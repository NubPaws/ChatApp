package com.example.androidapp.chats.database.dao;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.Query;
import androidx.room.Update;

import com.example.androidapp.chats.database.entities.User;

@Dao
public interface UserDao {

    @Insert
    void insert(User user);

    @Update
    void update(User user);

    @Query("SELECT * FROM users WHERE id = :userId")
    User get(int userId);

    @Query("SELECT * FROM users LIMIT 1")
    User getUser();

    @Query("DELETE FROM users")
    void deleteTable();

}
