package com.example.androidapp.chatscreen;

import java.util.Date;

public class ContactCard {

    // Will be automatically generated when we add Room.
    private int id;
    private int profileImage;
    private String displayName;
    private Date lastMessage;

    public ContactCard(int profileImage, String displayName, Date lastMessage) {
        this.profileImage = profileImage;
        this.displayName = displayName;
        this.lastMessage = lastMessage;
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

    public Date getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(Date lastMessage) {
        this.lastMessage = lastMessage;
    }

}
