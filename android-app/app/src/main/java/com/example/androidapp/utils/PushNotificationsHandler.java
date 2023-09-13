package com.example.androidapp.utils;

import static androidx.core.content.ContextCompat.checkSelfPermission;

import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;

import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;

import com.example.androidapp.R;

public class PushNotificationsHandler {

    public static final int PERMISSION_REQUEST_CODE = 1;
    public static final String POST_NOTIFICATION_PERMISSION = "android.permission.POST_NOTIFICATIONS";

    private final Context context;
    private final String channelId;

    public PushNotificationsHandler(Context context) {
        this.context = context;
        this.channelId = "push_chat_app_id";

        NotificationChannel channel = new NotificationChannel(channelId, "push_chat_app_name", NotificationManager.IMPORTANCE_HIGH);
        channel.setDescription("Push notifications channel for incoming messages.");
        NotificationManager manager = context.getSystemService(NotificationManager.class);
        manager.createNotificationChannel(channel);
    }

    public boolean needPermissions() {
        return checkSelfPermission(context, POST_NOTIFICATION_PERMISSION) != PackageManager.PERMISSION_GRANTED;
    }

    public void requestNotificationPermission(Activity activity) {
        ActivityCompat.requestPermissions(activity,
                new String[] {POST_NOTIFICATION_PERMISSION},
                PERMISSION_REQUEST_CODE);
    }

    public void displayNotification(int id, String title, String content) {
        if (needPermissions())
            return;

        // Build the notification.
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, channelId)
                .setSmallIcon(R.drawable.ic_launcher_foreground)
                .setContentTitle(title)
                .setContentText(content)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);

        NotificationManager manager = context.getSystemService(NotificationManager.class);
        manager.notify(id, builder.build());
    }

    public void displayNotification(int id, String title, String content, Intent intent) {
        if (needPermissions())
            return;

        // Build the notification.
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context, channelId)
                .setSmallIcon(R.drawable.ic_launcher_foreground)
                .setContentTitle(title)
                .setContentText(content)
                .setPriority(NotificationCompat.PRIORITY_HIGH);

        // Make it so when the user presses the application he gets right into his chat.
        PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, intent, PendingIntent.FLAG_IMMUTABLE);
        builder.setContentIntent(pendingIntent);

        NotificationManager manager = context.getSystemService(NotificationManager.class);
        manager.notify(id, builder.build());
    }

}
