package com.example.androidapp.chats;

import java.text.DateFormat;
import java.util.Date;

public class ChatMessage {

    public enum Direction {Left, Right};

    private String content;
    private Date sent;
    private Direction direction;

    public ChatMessage(String content, Date sent, Direction direction) {
        this.content = content;
        this.sent = sent;
        this.direction = direction;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSent() {
        return DateFormat.getDateTimeInstance().format(sent);
    }

    public void setSent(Date sent) {
        this.sent = sent;
    }

    public Direction getDirection() {
        return direction;
    }

    public void setDirection(Direction direction) {
        this.direction = direction;
    }
}
