package com.example.androidapp.chats;

import androidx.appcompat.app.AppCompatActivity;
import androidx.recyclerview.widget.RecyclerView;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AbsListView;
import android.widget.ListView;
import android.widget.Toast;

import com.example.androidapp.MainActivity;
import com.example.androidapp.R;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ContactListActivity extends AppCompatActivity implements AbsListView.OnScrollListener {

    private String jwtToken;

    private List<ContactCard> contacts;
    private FloatingActionButton fab;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_contact_list);

        this.jwtToken = (String)savedInstanceState.get(MainActivity.JWT_TOKEN_KEY);

        ListView contactListView = findViewById(R.id.contact_list_view);
        contacts = generateContacts();
        final ContactsAdapter adapter = new ContactsAdapter(contacts);
        contactListView.setAdapter(adapter);

        contactListView.setOnItemClickListener((parent, view, pos, id) -> {
            ContactCard cc = contacts.get(pos);
            Toast.makeText(this, cc.getDisplayName(), Toast.LENGTH_SHORT).show();
        });

        fab = findViewById(R.id.contact_add_btn);
        contactListView.setOnScrollListener(this);

        startActivity(new Intent(ContactListActivity.this, ChatActivity.class));
    }

    private List<ContactCard> generateContacts() {
        List<ContactCard> cards = new ArrayList<>();

        for (int i = 0; i < 10; i++)
            cards.add(new ContactCard(R.drawable.ic_launcher_background, "A" + i, new Date()));

        return cards;
    }

    @Override
    public void onScrollStateChanged(AbsListView view, int scrollState) {}

    @Override
    public void onScroll(AbsListView view, int firstVisibleItem, int visibleItemCount, int totalItemCount) {
        if (firstVisibleItem > 0)
            fab.hide();
        else
            fab.show();
    }
}