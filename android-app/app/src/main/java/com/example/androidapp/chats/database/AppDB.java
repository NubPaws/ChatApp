package com.example.androidapp.chats.database;

import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

import com.example.androidapp.MainActivity;
import com.example.androidapp.chats.database.dao.ContactCardDao;
import com.example.androidapp.chats.database.dao.UserDao;
import com.example.androidapp.chats.database.entities.ContactCard;
import com.example.androidapp.chats.database.entities.User;

@Database(entities = {ContactCard.class, User.class}, version = 3)
public abstract class AppDB extends RoomDatabase {

    public static final String NAME = "ChatDB";

    public abstract ContactCardDao contactCardDao();

    public abstract UserDao userDao();

    public static AppDB create(Context context) {
        return Room.databaseBuilder(context, AppDB.class, NAME)
                .fallbackToDestructiveMigration()
                .build();
    }

}
