package com.example.androidapp.connectivity;

import android.content.Intent;

import androidx.annotation.NonNull;

import com.example.androidapp.R;
import com.example.androidapp.authentication.LoginActivity;
import com.example.androidapp.utils.PushNotificationsHandler;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import java.util.Map;
import java.util.Objects;

public class ChatMessagesService extends FirebaseMessagingService {

    public static final String ACTION_DATA_UPDATED = "com.example.androidapp.DATA_UPDATED";
    private static int registeredReceivers = 0;

    public static void addRegisteredReceiver() {
        registeredReceivers += 1;
    }

    public static void removeRegisteredReceiver() {
        registeredReceivers -= 1;
    }

    private PushNotificationsHandler notificationsHandler = null;

    @Override
    public void onMessageReceived(@NonNull RemoteMessage message) {
        super.onMessageReceived(message);

        if (notificationsHandler == null) {
            notificationsHandler = new PushNotificationsHandler(this);
        }

        Map<String, String> data = message.getData();
        if (data.size() == 0)
            return;

        int chatId = Integer.parseInt(Objects.requireNonNull(data.get("chatId")));
        String displayName = data.get("displayName");
        String content = data.get("content");

        if (registeredReceivers > 0) {
            // Send data to the app.
            setDataToActivity(chatId, displayName, content);
        } else {
            // Send push notification.
            Intent intent = new Intent(getApplicationContext(), LoginActivity.class);
            notificationsHandler.displayNotification(chatId, displayName, content, intent);
        }
    }

    private void setDataToActivity(int chatId, String displayName, String content) {
        Intent intent = new Intent(ACTION_DATA_UPDATED);
        intent.putExtra("chatId", chatId);
        intent.putExtra("displayName", displayName);
        intent.putExtra("content", content);

        sendBroadcast(intent);
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