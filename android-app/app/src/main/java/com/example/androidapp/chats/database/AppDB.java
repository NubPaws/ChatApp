package com.example.androidapp.chats.database;

import androidx.room.Database;
import androidx.room.RoomDatabase;

@Database(entities = {ContactCard.class}, version = 1)
public abstract class AppDB extends RoomDatabase {

    public abstract ContactCardDao contactCardDao();

}
