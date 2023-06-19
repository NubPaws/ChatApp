package com.example.androidapp.chats.messages;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.widget.ImageButton;
import android.widget.Toast;

import com.example.androidapp.MainActivity;
import com.example.androidapp.R;
import com.example.androidapp.api.ChatAppAPI;
import com.example.androidapp.api.responses.MessageResponse;
import com.example.androidapp.chats.database.AppDB;
import com.example.androidapp.chats.database.dao.ChatMessageDao;
import com.example.androidapp.chats.database.entities.ChatMessage;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ChatActivity extends AppCompatActivity implements Callback<MessageResponse[]> {

    // Constant used to define an invalid chat id as the default value.
    private static final int INVALID_CHAT_ID = -1;

    private String jwtToken;
    private int chatId;
    private String username;
    private ChatMessageAdapter adapter;
    private List<ChatMessage> messages;

    private AppDB db;
    private ChatMessageDao messagesDao;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        db = AppDB.create(getApplicationContext());

        Intent intent = getIntent();
        jwtToken = intent.getStringExtra(MainActivity.JWT_TOKEN_KEY);
        chatId = intent.getIntExtra(MainActivity.CHAT_ID_KEY, INVALID_CHAT_ID);
        username = intent.getStringExtra(MainActivity.USERNAME_KEY);

        if (chatId == INVALID_CHAT_ID) {
            Toast.makeText(this, "Invalid Chat ID", Toast.LENGTH_SHORT).show();
            return;
        }

        loadMessages();

        ImageButton backButton = findViewById(R.id.chat_screen_back_button);
        backButton.setOnClickListener(v -> finish());
    }

    private void loadMessages() {
        // Load the recycler view.
        RecyclerView recyclerView = findViewById(R.id.chat_messages_recycler_view);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        // This will make the messages be anchored to the bottom of the page.
        layoutManager.setStackFromEnd(true);
        recyclerView.setLayoutManager(layoutManager);

        ExecutorService executor = Executors.newSingleThreadExecutor();
        Handler handler = new Handler(Looper.getMainLooper());

        executor.execute(() -> {
            messagesDao = db.chatMessageDao();

            adapter = new ChatMessageAdapter(messagesDao.index());

            ChatAppAPI api = ChatAppAPI.createAPI(getApplicationContext());

            api.getMessages(chatId).enqueue(this);

            handler.post(() -> {
                recyclerView.setAdapter(adapter);
            });
        });
    }

    private void updateChatMessages() {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Handler handler = new Handler(Looper.getMainLooper());

        executor.execute(() -> {
            if (db == null)
                return;
            messages = db.chatMessageDao().index();
            handler.post(() -> {
                int index = adapter.getItemCount();
                adapter.addMessages(messages);
                adapter.notifyItemRangeInserted(index, adapter.getItemCount());
            });
        });
    }

    private void addChatMessagesToList(MessageResponse[] allMessages) {
        ExecutorService executor = Executors.newSingleThreadExecutor();

        executor.execute(() -> {
            ChatMessage lastSentMsg = messagesDao.getLastChatMessage();
            boolean startAdding = false;
            for (MessageResponse msg : allMessages) {
                if (lastSentMsg.getId() == msg.getId()) {
                    startAdding = true;
                    continue;
                }
                if (startAdding) {
                    ChatMessage cMsg = new ChatMessage(
                            msg.getId(),
                            msg.getContent(),
                            msg.getCreated(),
                            0);
                    if (msg.getSender().getUsername().equals(username))
                        cMsg.setDirection(ChatMessage.DIR_RIGHT);
                    else cMsg.setDirection(ChatMessage.DIR_LEFT);
                    messagesDao.insert(cMsg);
                }
            }
        });
    }

    @Override
    public void onResponse(Call<MessageResponse[]> call, Response<MessageResponse[]> response) {
        if (response.code() != ChatAppAPI.OK_STATUS) {
            Toast.makeText(this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
            return;
        }

        MessageResponse[] allMessages = response.body();
        if (allMessages == null) {
            return;
        }
        addChatMessagesToList(allMessages);
        updateChatMessages();
    }

    @Override
    public void onFailure(Call<MessageResponse[]> call, Throwable t) {}

}