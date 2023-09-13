package com.example.androidapp.api.responses;

import com.google.gson.annotations.SerializedName;

public class SendMessageResponse {

    @SerializedName("id")
    private int id;

    @SerializedName("created")
    private String created;

    @SerializedName("sender")
    private Sender sender;

    @SerializedName("content")
    private String content;

    public SendMessageResponse(int id, String created, Sender sender, String content) {
        this.id = id;
        this.created = created;
        this.sender = sender;
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

    public Sender getSender() {
        return sender;
    }

    public void setSender(Sender sender) {
        this.sender = sender;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public static class Sender {

        @SerializedName("username")
        private String username;

        @SerializedName("displayName")
        private String displayName;

        @SerializedName("profilePic")
        private String profilePic;

        public Sender(String username, String displayName, String profilePic) {
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

}
