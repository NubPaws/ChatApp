package com.example.androidapp.api.requests;

import com.google.gson.annotations.SerializedName;

public class SendMessageRequest {

    @SerializedName("msg")
    private String msg;

    public SendMessageRequest(String msg) {
        this.msg = msg;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}
