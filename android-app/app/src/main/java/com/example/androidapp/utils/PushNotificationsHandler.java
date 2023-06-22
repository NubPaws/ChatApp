package com.example.androidapp.utils;

import static androidx.core.content.ContextCompat.checkSelfPermission;

import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.content.pm.PackageManager;

import androidx.core.app.ActivityCompat;
import androidx.core.app.NotificationCompat;

import com.example.androidapp.R;

public class PushNotificationsHandler {

    public static final int PERMISSION_REQUEST_CODE = 1;
    public static final String POST_NOTIFICATION_PERMISSION = "android.permission.POST_NOTIFICATIONS";

    private final Activity activity;
    private final String channelId;
    private final String channelName;
    private final int importance = NotificationManager.IMPORTANCE_HIGH;

    private NotificationChannel channel;

    public PushNotificationsHandler(Activity activity, String channelId, String channelName) {
        this.activity = activity;
        this.channelId = channelId;
        this.channelName = channelName;

        channel = new NotificationChannel(channelId, channelName, importance);
        channel.setDescription("Push notifications channel for incoming messages.");
        NotificationManager manager = activity.getSystemService(NotificationManager.class);
        manager.createNotificationChannel(channel);
    }

    public boolean needPermissions() {
        return checkSelfPermission(activity, POST_NOTIFICATION_PERMISSION) != PackageManager.PERMISSION_GRANTED;
    }

    public void requestNotificationPermission() {
        ActivityCompat.requestPermissions(activity,
                new String[] {POST_NOTIFICATION_PERMISSION},
                PERMISSION_REQUEST_CODE);
    }

    public void displayNotification(int id, String title, String content) {
        if (needPermissions())
            return;

        // Build the notification.
        NotificationCompat.Builder builder = new NotificationCompat.Builder(activity, channelId)
                .setSmallIcon(R.drawable.ic_launcher_foreground)
                .setContentTitle(title)
                .setContentText(content)
                .setPriority(NotificationCompat.PRIORITY_DEFAULT);

        NotificationManager manager = activity.getSystemService(NotificationManager.class);
        manager.notify(id, builder.build());
    }

    public void displayNotification(int id, String title, String content, Intent intent) {
        if (needPermissions())
            return;

        // Build the notification.
        NotificationCompat.Builder builder = new NotificationCompat.Builder(activity, channelId)
                .setSmallIcon(R.drawable.ic_launcher_foreground)
                .setContentTitle(title)
                .setContentText(content)
                .setPriority(NotificationCompat.PRIORITY_HIGH);

        // Make it so when the user presses the application he gets right into his chat.
        PendingIntent pendingIntent = PendingIntent.getActivity(activity, 0, intent, PendingIntent.FLAG_IMMUTABLE);
        builder.setContentIntent(pendingIntent);

        NotificationManager manager = activity.getSystemService(NotificationManager.class);
        manager.notify(id, builder.build());
    }

}
