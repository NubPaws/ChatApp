package com.example.androidapp.chats.connectivity;

import androidx.annotation.NonNull;

import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class ChatMessagesService extends FirebaseMessagingService {

    private String token;

    public ChatMessagesService() {
        token = "";
    }

    @Override
    public void onMessageReceived(@NonNull RemoteMessage message) {
        super.onMessageReceived(message);
    }

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);
        this.token = token;
    }
}