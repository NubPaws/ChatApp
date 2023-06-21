package com.example.androidapp.chats.messages;

import static com.example.androidapp.MainActivity.JWT_TOKEN_KEY;
import static com.example.androidapp.MainActivity.USERNAME_KEY;
import static com.example.androidapp.MainActivity.CHAT_ID_KEY;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.graphics.Rect;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.example.androidapp.R;
import com.example.androidapp.api.ChatAppAPI;
import com.example.androidapp.api.requests.SendMessageRequest;
import com.example.androidapp.api.responses.MessageResponse;
import com.example.androidapp.api.responses.SendMessageResponse;
import com.example.androidapp.chats.database.AppDB;
import com.example.androidapp.chats.database.ChatViewModel;
import com.example.androidapp.chats.database.dao.ChatMessageDao;
import com.example.androidapp.chats.database.entities.ChatMessage;
import com.example.androidapp.chats.database.entities.ContactCard;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ChatActivity extends AppCompatActivity
        implements View.OnClickListener, Observer<List<ChatMessage>> {

    // Constant used to define an invalid chat id as the default value.
    private static final int INVALID_CHAT_ID = -1;

    // Information about the user for backend access and what not yum yum.
    private String jwtToken;
    private int chatId;
    private String username;

    // Information regarding the view.
    private ChatMessageAdapter adapter;
    private EditText messageEditText;
    private RecyclerView recyclerView;

    // Information regarding the database.
    private AppDB db;
    private ChatViewModel chatViewModel;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        // Build an instance of the app database.
        db = AppDB.create(getApplicationContext());

        // Load the view model.
        chatViewModel = new ViewModelProvider(this).get(ChatViewModel.class);
        chatViewModel.getMessages().observe(this, this);

        loadIntentInformation();

        // Load the chat bar with the proper information.
        loadChatBar();

        initRecyclerView();
        loadMessages();

        // Setup the back button to work, as you know, it should.
        ImageButton backButton = findViewById(R.id.chat_screen_back_button);
        backButton.setOnClickListener(v -> finish());

        // Load the button with the proper listener for sending messages.
        ImageButton sendButton = findViewById(R.id.send_message_btn);
        // Make sure that the message text edit is available for usage.
        messageEditText = findViewById(R.id.message_content_edit_text);
        // Set up the click listener.
        sendButton.setOnClickListener(this);
    }

    private void loadIntentInformation() {
        Intent intent = getIntent();
        jwtToken = intent.getStringExtra(JWT_TOKEN_KEY);
        chatId = intent.getIntExtra(CHAT_ID_KEY, INVALID_CHAT_ID);
        username = intent.getStringExtra(USERNAME_KEY);

        if (chatId == INVALID_CHAT_ID) {
            Toast.makeText(this, "Invalid Chat ID", Toast.LENGTH_SHORT).show();
            finish();
        }
    }

    /**
     * Loads the data from the dao and updates the chat activity bar accordingly.
     */
    private void loadChatBar() {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Handler handler = new Handler(Looper.getMainLooper());

        executor.execute(() -> {
            ContactCard cc = db.contactCardDao().getByChatId(chatId);

            if (cc == null)
                return;

            handler.post(() -> {
                TextView displayNameView = findViewById(R.id.chat_screen_title);
                displayNameView.setText(cc.getDisplayName());

                ImageView profilePicView = findViewById(R.id.chat_screen_profile_pic);
                profilePicView.setImageBitmap(cc.getProfileImageBitmap());
            });
        });
    }

    /**
     * Initializes the recycler view with the proper styling and also initializes
     * the list's adapter.
     */
    private void initRecyclerView() {
        recyclerView = findViewById(R.id.chat_messages_recycler_view);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        // This will make the messages be anchored to the bottom of the page.
        layoutManager.setStackFromEnd(true);
        recyclerView.setLayoutManager(layoutManager);

        recyclerView.addItemDecoration(new RecyclerView.ItemDecoration() {
            @Override
            public void getItemOffsets(@NonNull Rect outRect, @NonNull View view, @NonNull RecyclerView parent,
                                       @NonNull RecyclerView.State state) {
                super.getItemOffsets(outRect, view, parent, state);

                if (parent.getAdapter() == null)
                    return;

                if (parent.getChildAdapterPosition(view) != parent.getAdapter().getItemCount())
                    outRect.bottom = getResources().getDimensionPixelSize(R.dimen.chat_messages_divider_size);
            }
        });

        // Load up the adapter.
        adapter = new ChatMessageAdapter(new ArrayList<>());
        recyclerView.setAdapter(adapter);
    }

    private void loadMessages() {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Handler handler = new Handler(Looper.getMainLooper());

        executor.execute(() -> {
            // Update the adapter.
            // Make sure to update the adapter only on the main thread... RecyclerView...
            List<ChatMessage> chatMessages = db.chatMessageDao().index();
            handler.post(() -> adapter.setMessages(chatMessages));

            // Load the API call, here we goooooo!
            ChatAppAPI api = ChatAppAPI.createAPI(getApplicationContext());
            // Queue the API call and watch out for raccoons, and their followers.
            api.getMessages(jwtToken, chatId).enqueue(new MessageResponseHandler());
        });
    }

    private void addChatMessagesToList(MessageResponse[] allMessages) {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Handler handler = new Handler(Looper.getMainLooper());

        executor.execute(() -> {
            if (db == null)
                return;

            List<ChatMessage> messages = new ArrayList<>();
            for (MessageResponse msg : allMessages) {
                messages.add(ChatMessage.build(chatId, username, msg));
            }

            handler.post(() -> chatViewModel.setChatMessages(messages));
        });
    }

    private void addMessageToList(SendMessageResponse message) {
        ChatMessage toAdd = new ChatMessage(
                chatId,
                message.getId(),
                message.getContent(),
                message.getCreated(),
                ChatMessage.DIR_RIGHT
        );
        chatViewModel.addChatMessages(toAdd);
    }

    @Override
    public void onClick(View v) {
        // Get the content and clear the edit text.
        String content = messageEditText.getText().toString();
        messageEditText.setText("");

        ChatAppAPI api = ChatAppAPI.createAPI(getApplicationContext());
        api.sendMessage(jwtToken, chatId, new SendMessageRequest(content))
                .enqueue(new SendMessageResponseHandler());
    }

    @Override
    public void onChanged(List<ChatMessage> messages) {
        // Update the dao.
        Executors.newSingleThreadExecutor().execute(() -> {
            if (db == null)
                return;

            ChatMessageDao dao = db.chatMessageDao();

            for (ChatMessage msg : messages) {
                ChatMessage fromDB = dao.get(msg.getChatId(), msg.getMessageId());
                if (fromDB == null) {
                    dao.insert(msg);
                }
            }
        });

        // Update the adapter with the new set of messages.
        int prevSize = adapter.getItemCount();
        adapter.setMessages(messages);
        // Notify only on those that we added that there was a change,
        // as the rest stayed the same (they really shouldn't change).
        adapter.notifyItemRangeInserted(prevSize, adapter.getItemCount());
        // Bump the scroll of the recycler view to the bottom of the screen.
        recyclerView.scrollToPosition(adapter.getItemCount() - 1);
    }

    private class MessageResponseHandler implements Callback<MessageResponse[]> {
        @Override
        public void onResponse(@NonNull Call<MessageResponse[]> call, Response<MessageResponse[]> response) {
            if (response.code() != ChatAppAPI.OK_STATUS) {
                Toast.makeText(ChatActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
                return;
            }

            MessageResponse[] allMessages = response.body();
            if (allMessages == null) {
                return;
            }
            addChatMessagesToList(allMessages);
        }

        @Override
        public void onFailure(@NonNull Call<MessageResponse[]> call, @NonNull Throwable t) {}
    }

    private class SendMessageResponseHandler implements Callback<SendMessageResponse> {
        @Override
        public void onResponse(@NonNull Call<SendMessageResponse> call, Response<SendMessageResponse> response) {
            if (response.code() != ChatAppAPI.OK_STATUS) {
                Toast.makeText(ChatActivity.this, "Failed to connect to server.", Toast.LENGTH_SHORT).show();
                return;
            }

            SendMessageResponse message = response.body();
            if (message != null)
                addMessageToList(message);
        }

        @Override
        public void onFailure(@NonNull Call<SendMessageResponse> call, @NonNull Throwable t) {}
    }

}