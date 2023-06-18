package com.example.androidapp.chats.database;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

import java.text.DateFormat;
import java.util.Date;

@Entity(tableName = "contacts")
public class ContactCard {

    @PrimaryKey(autoGenerate = true)
    private int id;
    private String username;
    private int profileImage;
    private String displayName;
    private String lastMessage;

    public ContactCard(String username, int profileImage, String displayName, String lastMessage) {
        this.profileImage = profileImage;
        this.displayName = displayName;
        this.lastMessage = lastMessage;
        this.username = username;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(int profileImage) {
        this.profileImage = profileImage;
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
