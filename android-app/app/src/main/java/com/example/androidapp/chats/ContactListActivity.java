package com.example.androidapp.chats;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.ListView;
import android.widget.Toast;

import com.example.androidapp.R;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ContactListActivity extends AppCompatActivity {

    private List<ContactCard> contacts;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_contact_list);

        ListView contactListView = findViewById(R.id.contact_list_view);
        contacts = generateContacts();
        final ContactsAdapter adapter = new ContactsAdapter(contacts);
        contactListView.setAdapter(adapter);
        contactListView.setOnItemClickListener((parent, view, pos, id) -> {
            ContactCard cc = contacts.get(pos);
            Toast.makeText(this, cc.getDisplayName(), Toast.LENGTH_SHORT).show();
        });
    }

    private List<ContactCard> generateContacts() {
        List<ContactCard> cards = new ArrayList<>();

        for (int i = 0; i < 10; i++)
            cards.add(new ContactCard(R.drawable.ic_launcher_background, "A", new Date()));

        return cards;
    }
}