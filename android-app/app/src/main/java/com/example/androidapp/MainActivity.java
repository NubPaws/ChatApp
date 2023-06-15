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
        intent.putExtra(JWT_TOKEN_KEY, "token_goes_here_from_login");
        startActivity(intent);
    }
}