package com.example.androidapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;

import com.example.androidapp.authentication.LoginActivity;
import com.example.androidapp.authentication.RegisterActivity;
import com.example.androidapp.chats.ChatActivity;
import com.example.androidapp.chats.ContactListActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Intent intent = new Intent(this, LoginActivity.class);
        startActivity(intent);

        // startActivity(new Intent(MainActivity.this, ContactListActivity.class));
    }
}