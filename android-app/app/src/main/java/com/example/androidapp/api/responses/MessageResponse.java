package com.example.androidapp.api.responses;

import com.google.gson.annotations.SerializedName;

public class MessageResponse {

    @SerializedName("id")
    private int id;

    @SerializedName("created")
    private String created;

    @SerializedName("sender")
    private Sender sender;

    @SerializedName("content")
    private String content;

    public MessageResponse(int id, String created, Sender sender, String content) {
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

        public Sender(String username) {
            this.username = username;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

    }

}
