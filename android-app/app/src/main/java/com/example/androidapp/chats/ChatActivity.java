package com.example.androidapp.chats;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.os.Bundle;
import android.widget.LinearLayout;

import com.example.androidapp.R;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ChatActivity extends AppCompatActivity {

    private ChatMessageAdapter adapter;
    private List<ChatMessage> messages;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_chat);

        RecyclerView recyclerView = findViewById(R.id.chat_messages_recycler_view);
        LinearLayoutManager layoutManager = new LinearLayoutManager(this);
        // This will make the messages be anchored to the bottom of the page.
        layoutManager.setStackFromEnd(true);
        recyclerView.setLayoutManager(layoutManager);

        messages = generateChatMessages();

        adapter = new ChatMessageAdapter(messages);
        recyclerView.setAdapter(adapter);
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