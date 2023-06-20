package com.example.androidapp.chats.messages;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
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

import com.example.androidapp.MainActivity;
import com.example.androidapp.R;
import com.example.androidapp.api.ChatAppAPI;
import com.example.androidapp.api.requests.SendMessageRequest;
import com.example.androidapp.api.responses.MessageResponse;
import com.example.androidapp.api.responses.SendMessageResponse;
import com.example.androidapp.chats.database.AppDB;
import com.example.androidapp.chats.database.dao.ChatMessageDao;
import com.example.androidapp.chats.database.entities.ChatMessage;
import com.example.androidapp.chats.database.entities.ContactCard;

import org.jetbrains.annotations.NotNull;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ChatActivity extends AppCompatActivity implements View.OnClickListener {

    // Constant used to define an invalid chat id as the default value.
    private static final int INVALID_CHAT_ID = -1;

    // Information about the user for backend access and what not yum yum.
    private String jwtToken;
    private int chatId;
    private String username;

    // Information regarding the view.
    private ChatMessageAdapter adapter;
    private List<ChatMessage> messages;
    private EditText messageEditText;
    private RecyclerView recyclerView;

    // Information regarding the database.
    private AppDB db;
    private ChatMessageDao messagesDao;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        // Build an instance of the app database.
        db = AppDB.create(getApplicationContext());

        // Get the jwtToken, the chatId and the username form the intent.
        Intent intent = getIntent();
        jwtToken = intent.getStringExtra(MainActivity.JWT_TOKEN_KEY);
        chatId = intent.getIntExtra(MainActivity.CHAT_ID_KEY, INVALID_CHAT_ID);
        username = intent.getStringExtra(MainActivity.USERNAME_KEY);

        if (chatId == INVALID_CHAT_ID) {
            Toast.makeText(this, "Invalid Chat ID", Toast.LENGTH_SHORT).show();
            finish();
        }

        // Once everything is okay, we can init the recycler view for the chat messages.
        initializeRecyclerView();
        // Load the messages up.
        loadMessages();

        // Setup the back button to work, as you know, it should.
        ImageButton backButton = findViewById(R.id.chat_screen_back_button);
        backButton.setOnClickListener(v -> finish());

        // Load the chat bar with the proper information.
        loadChatBar();

        // Load the button with the proper listener for sending messages.
        ImageButton sendButton = findViewById(R.id.send_message_btn);
        // Make sure that the message text edit is available for usage.
        messageEditText = findViewById(R.id.message_content_edit_text);
        // Set up the click listener.
        sendButton.setOnClickListener(this);
    }

    private void loadChatBar() {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Handler handler = new Handler(Looper.getMainLooper());

        executor.execute(() -> {
            ContactCard cc = db.contactCardDao().getByChatId(chatId);

            handler.post(() -> {
                TextView displayNameView = findViewById(R.id.chat_screen_title);
                displayNameView.setText(cc.getDisplayName());

                ImageView profilePicView = findViewById(R.id.chat_screen_profile_pic);
                profilePicView.setImageBitmap(cc.getProfileImageBitmap());
            });
        });
    }

    private RecyclerView initializeRecyclerView() {
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

        return recyclerView;
    }

    private void loadMessages() {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Handler handler = new Handler(Looper.getMainLooper());

        executor.execute(() -> {
            messagesDao = db.chatMessageDao();

            adapter = new ChatMessageAdapter(messagesDao.getChatMessages(chatId));

            ChatAppAPI api = ChatAppAPI.createAPI(getApplicationContext());

            api.getMessages(jwtToken, chatId).enqueue(new MessageResponseHandler(this));

            handler.post(() -> {
                recyclerView.setAdapter(adapter);
            });
            updateChatMessages();
        });
    }

    private synchronized void updateChatMessages() {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Handler handler = new Handler(Looper.getMainLooper());

        executor.execute(() -> {
            if (db == null)
                return;
            messages = db.chatMessageDao().getChatMessages(chatId);
            handler.post(() -> {
                int index = adapter.getItemCount();
                adapter.setMessages(messages);
                adapter.notifyItemRangeInserted(index, adapter.getItemCount());

                recyclerView.scrollToPosition(adapter.getItemCount() - 1);
            });
        });
    }

    private void addChatMessagesToList(MessageResponse[] allMessages) {
        ExecutorService executor = Executors.newSingleThreadExecutor();

        executor.execute(() -> {
            ChatMessage lastSentMsg = messagesDao.getLastChatMessage(chatId);
            boolean startAdding = false;

            for (MessageResponse msg : allMessages) {
                if (lastSentMsg == null) {
                    startAdding = true;
                } else if (lastSentMsg.getMessageId() == msg.getId()) {
                    startAdding = true;
                    continue;
                }
                if (startAdding) {
                    messagesDao.insert(ChatMessage.build(chatId, username, msg));
                }
            }

            updateChatMessages();
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

        ExecutorService executor = Executors.newSingleThreadExecutor();

        executor.execute(() -> {
            messagesDao.insert(toAdd);
            updateChatMessages();
        });
    }

    @Override
    public void onClick(View v) {
        // Get the content and clear the edit text.
        String content = messageEditText.getText().toString();
        messageEditText.setText("");

        ChatAppAPI api = ChatAppAPI.createAPI(getApplicationContext());
        api.sendMessage(jwtToken, chatId, new SendMessageRequest(content))
                .enqueue(new SendMessageResponseHandler(this));
    }

    private class MessageResponseHandler implements Callback<MessageResponse[]> {

        private ChatActivity chatActivity;

        public MessageResponseHandler(ChatActivity chatActivity) {
            this.chatActivity = chatActivity;
        }

        @Override
        public void onResponse(@NotNull Call<MessageResponse[]> call, Response<MessageResponse[]> response) {
            if (response.code() != ChatAppAPI.OK_STATUS) {
                Toast.makeText(chatActivity, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
                return;
            }

            MessageResponse[] allMessages = response.body();
            if (allMessages == null) {
                return;
            }
            addChatMessagesToList(allMessages);
        }

        @Override
        public void onFailure(@NotNull Call<MessageResponse[]> call, @NotNull Throwable t) {}
    }

    private class SendMessageResponseHandler implements Callback<SendMessageResponse> {

        private ChatActivity chatActivity;

        public SendMessageResponseHandler(ChatActivity chatActivity) {
            this.chatActivity = chatActivity;
        }

        @Override
        public void onResponse(@NotNull Call<SendMessageResponse> call, Response<SendMessageResponse> response) {
            if (response.code() != ChatAppAPI.OK_STATUS) {
                Toast.makeText(chatActivity, "Failed to connect to server.", Toast.LENGTH_SHORT).show();
                return;
            }

            SendMessageResponse message = response.body();
            if (message != null)
                addMessageToList(message);
        }

        @Override
        public void onFailure(@NotNull Call<SendMessageResponse> call, @NotNull Throwable t) {}
    }

}