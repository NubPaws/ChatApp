package com.example.androidapp.chats.database.dao;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import com.example.androidapp.chats.database.entities.ContactCard;

import java.util.List;

@Dao
public interface ContactCardDao {

    @Query("SELECT * FROM contacts")
    List<ContactCard> index();

    @Query("SELECT * FROM contacts WHERE id = :id")
    ContactCard get(int id);

    @Query("SELECT * FROM contacts WHERE username = :username LIMIT 1")
    ContactCard get(String username);

    @Query("SELECT * FROM contacts WHERE chatId = :chatId LIMIT 1")
    ContactCard getByChatId(int chatId);

    @Query("SELECT EXISTS(SELECT 1 FROM contacts WHERE username = :username LIMIT 1)")
    boolean exists(String username);

    @Insert
    void insert(ContactCard... cards);

    @Update
    void update(ContactCard... cards);

    @Delete
    void delete(ContactCard... cards);

    @Query("DELETE FROM contacts")
    void deleteTable();
}
