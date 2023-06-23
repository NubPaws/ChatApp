package com.example.androidapp.connectivity;

import androidx.annotation.NonNull;

import com.example.androidapp.R;
import com.example.androidapp.utils.PushNotificationsHandler;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;

public class ChatMessagesService extends FirebaseMessagingService {

    private PushNotificationsHandler notificationsHandler = null;

    @Override
    public void onMessageReceived(@NonNull RemoteMessage message) {
        super.onMessageReceived(message);

        if (notificationsHandler == null) {
            notificationsHandler = new PushNotificationsHandler(this, "push_notifications", "push_channel");
        }

    }

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);

        getSharedPreferences(getString(R.string.shared_prefs_name), MODE_PRIVATE)
                .edit()
                .putString(getString(R.string.fcm_token_key), token)
                .apply();
    }

}