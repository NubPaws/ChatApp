package com.example.androidapp.chats.messages;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.widget.ImageButton;

import com.example.androidapp.MainActivity;
import com.example.androidapp.R;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class ChatActivity extends AppCompatActivity {

    // Constant used to define an invalid chat id as the default value.
    private static final int INVALID_CHAT_ID = -1;

    private String jwtToken;
    private int chatId;
    private ChatMessageAdapter adapter;
    private List<ChatMessage> messages;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        Intent intent = getIntent();
        jwtToken = intent.getStringExtra(MainActivity.JWT_TOKEN_KEY);
        chatId = intent.getIntExtra(MainActivity.CHAT_ID_KEY, INVALID_CHAT_ID);

        loadMessages();

        RecyclerView recyclerView = findViewById(R.id.chat_messages_recycler_view);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        // This will make the messages be anchored to the bottom of the page.
        layoutManager.setStackFromEnd(true);
        recyclerView.setLayoutManager(layoutManager);

        messages = generateChatMessages();

        adapter = new ChatMessageAdapter(messages);
        recyclerView.setAdapter(adapter);

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

        });
    }

    private List<ChatMessage> generateChatMessages() {
        List<ChatMessage> messages = new ArrayList<>();

        for (int i = 0; i < 10; i++) {
            messages.add(new ChatMessage("Hello", new Date(), ChatMessage.Direction.Right));
            messages.add(new ChatMessage("Hello", new Date(), ChatMessage.Direction.Left));
        }

        return messages;
    }

}