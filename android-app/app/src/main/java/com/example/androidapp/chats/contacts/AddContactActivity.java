package com.example.androidapp.chats.contacts;

import androidx.appcompat.app.AppCompatActivity;
import androidx.room.Room;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.example.androidapp.R;
import com.example.androidapp.chats.database.AppDB;
import com.example.androidapp.chats.database.entities.ContactCard;
import com.example.androidapp.chats.database.dao.ContactCardDao;

import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class AddContactActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_contact);

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
        Handler handler = new Handler(Looper.getMainLooper());

        executor.execute(() -> {
            AppDB db = Room.databaseBuilder(getApplicationContext(), AppDB.class, "ChatDB").build();
            ContactCardDao contactsDao = db.contactCardDao();
            // TODO: Check that the username is indeed in the database.

            /* TODO: After checking that the username exists load the proper information which is -
                : chatId, username, profilePic, displayName, lastMessage
            */
            // ContactCard card = new ContactCard(username, "", username, new Date().toString());
            // List<ContactCard> cards = contactsDao.index();
            // contactsDao.insert(card);

            handler.post(this::finish);
        });
    }

}