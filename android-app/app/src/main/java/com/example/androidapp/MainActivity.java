package com.example.androidapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;

import com.example.androidapp.chats.contacts.ContactListActivity;

public class MainActivity extends AppCompatActivity {

    public static final String JWT_TOKEN_KEY = "JWT_TOKEN";
    public static final String USERNAME_KEY = "username";
    public static final String CHAT_ID_KEY = "other_username";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Intent intent = new Intent(MainActivity.this, ContactListActivity.class);
        // TMP Token that is used only for testing :D
        intent.putExtra(JWT_TOKEN_KEY, "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhbWkiLCJpYXQiOjE2ODcxMjIyOTN9.SvrmYHrzt2O3svPDay10a8nx3qDxu9ibT3GeU08Os1M");
        intent.putExtra(USERNAME_KEY, "rami");
        startActivity(intent);
      
//        Intent intent = new Intent(this, LoginActivity.class);
//        startActivity(intent);
    }
}