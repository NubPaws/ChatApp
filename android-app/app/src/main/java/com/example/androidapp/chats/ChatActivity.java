package com.example.androidapp.chats;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.widget.ImageButton;

import com.example.androidapp.MainActivity;
import com.example.androidapp.R;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ChatActivity extends AppCompatActivity {

    private String jwtToken;
    private String username;
    private ChatMessageAdapter adapter;
    private List<ChatMessage> messages;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        Intent intent = getIntent();
        jwtToken = intent.getStringExtra(MainActivity.JWT_TOKEN_KEY);
        username = intent.getStringExtra("username");

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

    private List<ChatMessage> generateChatMessages() {
        List<ChatMessage> messages = new ArrayList<>();

        for (int i = 0; i < 10; i++) {
            messages.add(new ChatMessage("Hello", new Date(), ChatMessage.Direction.Right));
            messages.add(new ChatMessage("Hello", new Date(), ChatMessage.Direction.Left));
        }

        return messages;
    }

}