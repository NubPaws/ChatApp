package com.example.androidapp.chats.database;

import androidx.room.Dao;
import androidx.room.Delete;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import java.util.List;

@Dao
public interface ContactCardDao {

    @Query("SELECT * FROM contacts")
    List<ContactCard> index();

    @Query("SELECT * FROM contacts WHERE id = :id")
    ContactCard get(int id);

    @Insert
    void insert(ContactCard... cards);

    @Update
    void update(ContactCard... cards);

    @Delete
    void delete(ContactCard... cards);

}
