package com.example.androidapp.chats.database.entities;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

import java.text.DateFormat;
import java.util.Date;

@Entity(tableName = "contacts")
public class ContactCard {

    @PrimaryKey(autoGenerate = true)
    private int id;
    private int chatId;
    private String username;
    private String profileImage;
    private String displayName;
    private String lastMessage;

    public ContactCard(int chatId, String username, String profileImage, String displayName, String lastMessage) {
        this.chatId = chatId;
        this.username = username;
        setProfileImage(profileImage);
        this.displayName = displayName;
        this.lastMessage = lastMessage;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getChatId() {
        return chatId;
    }

    public void setChatId(int chatId) {
        this.chatId = chatId;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public Bitmap getProfileImageBitmap() {
        byte[] decodes = Base64.decode(profileImage, Base64.DEFAULT);
        return BitmapFactory.decodeByteArray(decodes, 0, decodes.length);
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage.substring(profileImage.indexOf(",") + 1);
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
