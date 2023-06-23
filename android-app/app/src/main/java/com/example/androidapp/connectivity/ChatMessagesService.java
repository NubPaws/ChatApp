package com.example.androidapp.connectivity;

import android.content.Context;

import androidx.annotation.NonNull;

import com.example.androidapp.R;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class ChatMessagesService extends FirebaseMessagingService {

    private final String PREFS_NAME = getString(R.string.shared_prefs_name);
    private final String FCM_TOKEN_KEY = getString(R.string.fcm_token_key);

    @Override
    public void onMessageReceived(@NonNull RemoteMessage message) {
        super.onMessageReceived(message);
    }

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);

        getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
                .edit()
                .putString(FCM_TOKEN_KEY, token)
                .apply();
    }

    public String getToken(Context context) {
        return context.getSharedPreferences(PREFS_NAME, MODE_PRIVATE)
                .getString(FCM_TOKEN_KEY, "");
    }
}