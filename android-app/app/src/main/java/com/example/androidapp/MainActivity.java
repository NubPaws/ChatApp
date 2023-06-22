package com.example.androidapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;

import com.example.androidapp.authentication.LoginActivity;
import com.example.androidapp.chats.contacts.ContactListActivity;
import com.example.androidapp.settings.SettingsActivity;

public class MainActivity extends AppCompatActivity {

    public static final String JWT_TOKEN_KEY = "jwt_token";
    public static final String USERNAME_KEY = "username";
    public static final String CHAT_ID_KEY = "chat_id";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

//        Intent intent = new Intent(MainActivity.this, ContactListActivity.class);
//        // TMP Token that is used only for testing :D
//        intent.putExtra(JWT_TOKEN_KEY, "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhbWkiLCJpYXQiOjE2ODcyMTExNTB9.asvk1JfN_FzL4QkT0TvFUROwokuyuFbwL0LLvm4Fcoc");
//        intent.putExtra(USERNAME_KEY, "rami");
//        startActivity(intent);
      
        Intent intent = new Intent(this, LoginActivity.class);
        startActivity(intent);
    }
}