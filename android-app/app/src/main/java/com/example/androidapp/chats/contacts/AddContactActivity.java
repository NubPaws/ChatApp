package com.example.androidapp.chats.contacts;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.example.androidapp.MainActivity;
import com.example.androidapp.R;
import com.example.androidapp.api.ChatAppAPI;
import com.example.androidapp.api.requests.AddContactRequest;

import org.jetbrains.annotations.NotNull;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class AddContactActivity extends AppCompatActivity {

    private String jwtToken;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_contact);

        jwtToken = getIntent().getStringExtra(MainActivity.JWT_TOKEN_KEY);

        final EditText editText = findViewById(R.id.add_contact_edit_text);
        Button cancelBtn = findViewById(R.id.add_contact_cancel_btn);
        Button addBtn = findViewById(R.id.add_contact_add_btn);

        // Once the user presses the cancel button.
        cancelBtn.setOnClickListener(v -> finish());

        // Once the user presses the accept button make sure that the username is valid.
        addBtn.setOnClickListener(v -> {
            String username = editText.getText().toString();
            if (username.isEmpty() || username.length() < 4) {
                Toast.makeText(this, "Please enter a valid name!", Toast.LENGTH_SHORT).show();
                return;
            }

            handleSave(username);

            finish();
        });

    }

    private void handleSave(String username) {
        ExecutorService executor = Executors.newSingleThreadExecutor();

        executor.execute(() -> {
            ChatAppAPI.createAPI(getApplicationContext())
                    .addContact(jwtToken, new AddContactRequest(username))
                    .enqueue(new AddContactResponseHandler());

        });
    }

    public class AddContactResponseHandler implements Callback<Void> {

        @Override
        public void onResponse(@NonNull Call<Void> call, @NonNull Response<Void> response) {
            if (response.isSuccessful()) {
                Toast.makeText(AddContactActivity.this, "Successfully added contact", Toast.LENGTH_SHORT).show();
            } else {
                Toast.makeText(AddContactActivity.this, "Failed to add contact", Toast.LENGTH_SHORT).show();
            }

            finish();
        }

        @Override
        public void onFailure(@NonNull Call<Void> call, @NonNull Throwable t) {

        }
    }

}