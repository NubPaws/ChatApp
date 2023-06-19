package com.example.androidapp.api.responses;

import com.google.gson.annotations.SerializedName;

public class LastMessage {

    @SerializedName("id")
    private int id;

    @SerializedName("user")
    private User user;

    @SerializedName("lastMessage")
    private MessageContent lastMessage;

    public LastMessage(int id, User user, MessageContent lastMessage) {
        this.id = id;
        this.user = user;
        this.lastMessage = lastMessage;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public MessageContent getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(MessageContent lastMessage) {
        this.lastMessage = lastMessage;
    }

    public static class User {

        @SerializedName("username")
        private String username;

        @SerializedName("displayName")
        private String displayName;

        @SerializedName("profilePic")
        private String profilePic;

        public User(String username, String displayName, String profilePic) {
            this.username = username;
            this.displayName = displayName;
            this.profilePic = profilePic;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getDisplayName() {
            return displayName;
        }

        public void setDisplayName(String displayName) {
            this.displayName = displayName;
        }

        public String getProfilePic() {
            return profilePic;
        }

        public void setProfilePic(String profilePic) {
            this.profilePic = profilePic;
        }
    }

    public static class MessageContent {

        @SerializedName("id")
        private int id;

        @SerializedName("created")
        private String created;

        @SerializedName("content")
        private String content;

        public MessageContent(int id, String created, String content) {
            this.id = id;
            this.created = created;
            this.content = content;
        }

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getCreated() {
            return created;
        }

        public void setCreated(String created) {
            this.created = created;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }

}
