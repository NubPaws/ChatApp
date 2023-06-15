package com.example.androidapp.authentication;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;

import com.example.androidapp.R;

public class LoginActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        Button btnLogin = findViewById(R.id.btnLogin);
        btnLogin.setOnClickListener(view -> {
            EditText etLoginUsername = findViewById(R.id.etLoginUsername);
            EditText etLoginPassword = findViewById(R.id.etLoginPassword);
            if (Validation.validateUsername(etLoginUsername)  && Validation.validatePassword(etLoginPassword)) {

            }
        });
    }
}