package com.example.androidapp.chats;

import androidx.activity.result.ActivityResultLauncher;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.AbsListView;
import android.widget.AdapterView;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.Toast;

import com.example.androidapp.MainActivity;
import com.example.androidapp.R;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ContactListActivity extends AppCompatActivity
        implements AbsListView.OnScrollListener, AdapterView.OnItemClickListener, SwipeRefreshLayout.OnRefreshListener {

    // chosen at random.
    private static final int ADD_CONTACT_REQUEST = 0x5;

    private String jwtToken;

    private List<ContactCard> contacts;
    private FloatingActionButton fab;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_contact_list);

        // Get that sweet sweet JWT token as we love it.
        jwtToken = getIntent().getStringExtra(MainActivity.JWT_TOKEN_KEY);

        // Load the data for the contacts, also load up the adapter.
        contacts = generateContacts();
        ContactsAdapter contactsAdapter = new ContactsAdapter(contacts);

        // The contact list view's scroll listener will be using the fab so we want to
        // have it created already.
        fab = findViewById(R.id.contact_add_btn);
        fab.setOnClickListener(v -> {
            Intent intent = new Intent(this, AddContactActivity.class);
            // TODO
            // https://stackoverflow.com/questions/62671106/onactivityresult-method-is-deprecated-what-is-the-alternative
        });

        // Setup the contacts' list view.
        ListView contactListView = findViewById(R.id.contact_list_view);
        contactListView.setAdapter(contactsAdapter);
        contactListView.setOnItemClickListener(this);
        contactListView.setOnScrollListener(this);

        // Make the back button work :D.
        ImageButton backBtn = findViewById(R.id.contact_list_back_button);
        backBtn.setOnClickListener(v -> finish());

        // Make our contact list updatable.
        SwipeRefreshLayout swiper = findViewById(R.id.swiper_layout);
        swiper.setOnRefreshListener(this);
    }

    private List<ContactCard> generateContacts() {
        List<ContactCard> cards = new ArrayList<>();

        for (int i = 0; i < 25; i++)
            cards.add(new ContactCard(R.drawable.ic_launcher_background, "A" + i, new Date(), "A" + i));

        return cards;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == ADD_CONTACT_REQUEST &&)
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

    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
        ContactCard cc = contacts.get(position);
        Intent intent = new Intent(ContactListActivity.this, ChatActivity.class);
        intent.putExtra("contact", cc.getUsername());
        intent.putExtra(MainActivity.JWT_TOKEN_KEY, jwtToken);
        startActivity(intent);
    }

    @Override
    public void onRefresh() {
        // TODO: Add the updating of the characters.
    }
}