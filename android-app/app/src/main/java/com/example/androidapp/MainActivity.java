package com.example.androidapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;

import com.example.androidapp.chats.ChatActivity;
import com.example.androidapp.chats.ContactListActivity;

public class MainActivity extends AppCompatActivity {

    public static final String JWT_TOKEN_KEY = "JWT_TOKEN";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Intent intent = new Intent(MainActivity.this, ContactListActivity.class);
        // TMP Token that is used only for testing :D
        intent.putExtra(JWT_TOKEN_KEY, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJhbWkiLCJpYXQiOjE2ODY4NDY2NjZ9.-nkW9lAbBX30fuBZm1RD0z8cK8yD2C2VCnkZEeB04MU");
        startActivity(intent);
    }
}