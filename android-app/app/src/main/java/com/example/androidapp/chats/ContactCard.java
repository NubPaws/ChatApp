package com.example.androidapp.chats;

import java.text.DateFormat;
import java.util.Date;

public class ContactCard {

    // Will be automatically generated when we add Room.
    private int id;
    private int profileImage;
    private String displayName;
    private Date lastMessage;
    private String username;

    public ContactCard(int profileImage, String displayName, Date lastMessage, String username) {
        this.profileImage = profileImage;
        this.displayName = displayName;
        this.lastMessage = lastMessage;
        this.username = username;
    }

    public int getId() {
        return 0;
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
        return DateFormat.getDateTimeInstance().format(lastMessage);
    }

    public void setLastMessage(Date lastMessage) {
        this.lastMessage = lastMessage;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

}
