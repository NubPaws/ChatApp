package com.example.androidapp.api.requests;

import com.google.gson.annotations.SerializedName;

public class AddContactRequest {

    @SerializedName("username")
    private String username;

    public AddContactRequest(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
