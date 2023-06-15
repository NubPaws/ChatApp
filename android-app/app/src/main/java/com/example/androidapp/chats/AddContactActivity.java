package com.example.androidapp.chats;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.example.androidapp.R;

public class AddContactActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_contact);

        final EditText editText = findViewById(R.id.add_contact_edit_text);
        Button cancelBtn = findViewById(R.id.add_contact_cancel_btn);
        Button addBtn = findViewById(R.id.add_contact_add_btn);

        // Once the user presses the cancel button.
        cancelBtn.setOnClickListener(v -> {
            setResult(RESULT_CANCELED);
            finish();
        });

        // Once the user presses the accept button make sure that the username is valid.
        addBtn.setOnClickListener(v -> {
            String username = editText.getText().toString();
            if (username.isEmpty() || username.length() < 4) {
                Toast.makeText(this, "Please enter a valid name!", Toast.LENGTH_SHORT).show();
                return;
            }
            Intent intent = new Intent();
            intent.putExtra("username", username);
            setResult(RESULT_CANCELED, intent);
            finish();
        });

    }
}