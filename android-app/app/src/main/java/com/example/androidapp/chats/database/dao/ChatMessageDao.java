package com.example.androidapp.chats.database.dao;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import com.example.androidapp.api.responses.MessageResponse;
import com.example.androidapp.chats.database.entities.ChatMessage;

import java.util.List;

@Dao
public interface ChatMessageDao {

    @Query("SELECT * FROM chat_messages")
    List<ChatMessage> index();

    @Query("SELECT * FROM chat_messages WHERE chatId = :chatId")
    List<ChatMessage> getChatMessages(int chatId);

    @Insert
    void insert(ChatMessage... messages);

    @Update
    void update(ChatMessage... messages);

    @Query("DELETE FROM chat_messages")
    void deleteTable();

    @Query("SELECT * FROM chat_messages ORDER BY timestamp DESC LIMIT 1")
    ChatMessage getLastChatMessage();
}
