package com.example.androidapp.chats.database.entities;

import androidx.room.Entity;
import androidx.room.PrimaryKey;

import com.example.androidapp.api.responses.MessageResponse;

@Entity(tableName = "chat_messages")
public class ChatMessage {

    public static final int DIR_LEFT = -1;
    public static final int DIR_RIGHT = 1;

    @PrimaryKey(autoGenerate = true)
    private int id;

    private int chatId;

    private int messageId;

    private String content;

    private String timestamp;

    // Can either be 1 or zero.
    private int direction;

    public ChatMessage(int chatId, int messageId, String content, String timestamp, int direction) {
        this.chatId = chatId;
        this.messageId = messageId;
        this.content = content;
        this.timestamp = timestamp;
        this.direction = direction;
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

    public int getMessageId() {
        return messageId;
    }

    public void setMessageId(int messageId) {
        this.messageId = messageId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public int getDirection() {
        return direction;
    }

    public void setDirection(int direction) {
        this.direction = direction;
    }

    public static ChatMessage build(int chatId, String username, MessageResponse msg) {
        final String sender = msg.getSender().getUsername();

        return new ChatMessage(
                chatId,
                msg.getId(),
                msg.getContent(),
                msg.getCreated(),
                sender.equals(username) ? DIR_RIGHT : DIR_LEFT);
    }

}
