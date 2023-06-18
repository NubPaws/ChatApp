package com.example.androidapp.chats;

import androidx.appcompat.app.AppCompatActivity;
import androidx.room.Room;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.View;
import android.widget.AbsListView;
import android.widget.AdapterView;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.Toast;

import com.example.androidapp.MainActivity;
import com.example.androidapp.R;
import com.example.androidapp.api.ChatAppAPI;
import com.example.androidapp.api.responses.LastMessageResponse;
import com.example.androidapp.chats.contacts.AddContactActivity;
import com.example.androidapp.chats.database.entities.ContactCard;
import com.example.androidapp.chats.contacts.ContactsAdapter;
import com.example.androidapp.chats.database.AppDB;
import com.example.androidapp.chats.database.dao.ContactCardDao;
import com.example.androidapp.chats.database.entities.User;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ContactListActivity extends AppCompatActivity
        implements AbsListView.OnScrollListener, AdapterView.OnItemClickListener,
        SwipeRefreshLayout.OnRefreshListener {

    private String jwtToken;
    private String username;

    private AppDB db;
    private ContactCardDao contactsDao;
    private List<ContactCard> contacts;
    private final ContactsAdapter adapter = new ContactsAdapter(null);
    private FloatingActionButton fab;
    private SwipeRefreshLayout swiper;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_contact_list);

        // Get that sweet sweet JWT token as we love it.
        Intent intent = getIntent();
        jwtToken = intent.getStringExtra(MainActivity.JWT_TOKEN_KEY);
        username = intent.getStringExtra(MainActivity.USERNAME_KEY);

        initAddContactFAB();

        loadContacts();

        // Make the back button work :D.
        ImageButton backBtn = findViewById(R.id.contact_list_back_button);
        backBtn.setOnClickListener(v -> finish());

        // Make our contact list updatable.
        swiper = findViewById(R.id.swiper_layout);
        swiper.setOnRefreshListener(this);
    }

    private void initAddContactFAB() {
        // The contact list view's scroll listener will be using the fab so we want to
        // have it created already.
        fab = findViewById(R.id.contact_add_btn);
        fab.setOnClickListener(v -> {
            startActivity(new Intent(this, AddContactActivity.class));
        });
    }

    private void loadContacts() {
        // Setup the contacts' list view.
        // Load the data for the contacts, also load up the adapter.
        ListView contactListView = findViewById(R.id.contact_list_view);

        ExecutorService executor = Executors.newSingleThreadExecutor();
        Handler handler = new Handler(Looper.getMainLooper());

        // Create the db and the contactsDao.
        executor.execute(() -> {
            db = AppDB.create(getApplicationContext());
            contactsDao = db.contactCardDao();

            User user = db.userDao().getUser();
            if (user == null) {
                db.userDao().insert(new User(username, jwtToken));
            } else if (!user.getUsername().equals(username)) {
                contactsDao.deleteTable();
            }

            // Set the contact list.
            contacts = contactsDao.index();
            adapter.setContacts(contacts);

            // Show that we are loading the new contacts.
            runOnUiThread(() -> {
                swiper.setRefreshing(true);
                contactListView.setAdapter(adapter);
            });

            // Load the contacts from the backend.
            ChatAppAPI api = ChatAppAPI.createAPI(getApplicationContext());
            Call<LastMessageResponse[]> call = api.lastMessages(jwtToken);

            call.enqueue(new Callback<LastMessageResponse[]>() {
                @Override
                public void onResponse(Call<LastMessageResponse[]> call, Response<LastMessageResponse[]> response) {
                    Log.e("onResponse", "Value of response body length : " + response.body().length);
                    LastMessageResponse[] lastMessages = response.body();
                    if (lastMessages == null)
                        return;
                    addContactCardResponseToList(lastMessages);
                }

                @Override
                public void onFailure(Call<LastMessageResponse[]> call, Throwable t) {}
            });

            // Stop refreshing and set the adapter accordingly.
            handler.post(() -> swiper.setRefreshing(false));
        });

        contactListView.setOnItemClickListener(this);
        contactListView.setOnScrollListener(this);
    }

    private void addContactCardResponseToList(LastMessageResponse[] lastMessages) {
        ExecutorService executor = Executors.newSingleThreadExecutor();

        executor.execute(() -> {
            for (LastMessageResponse msg : lastMessages) {
                if (contactsDao.exists(msg.getUser().getUsername())) {
                    ContactCard card = contactsDao.get(msg.getUser().getUsername());
                    card.setLastMessage(msg.getLastMessage().getCreated());
                    contactsDao.update(card);
                } else {
                    ContactCard card = new ContactCard(
                            msg.getUser().getUsername(),
                            msg.getUser().getProfilePic(),
                            msg.getUser().getDisplayName(),
                            msg.getLastMessage().getCreated()
                    );
                    contactsDao.insert(card);
                }
            }
        });

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
        Toast.makeText(this, "Refreshing... [not really though]", Toast.LENGTH_SHORT).show();
        // Stop the refreshing animation.
        swiper.setRefreshing(false);
        // TODO: Add the updating of the characters.
    }

    @Override
    protected void onResume() {
        super.onResume();

        ExecutorService executor = Executors.newSingleThreadExecutor();
        Handler handler = new Handler(Looper.getMainLooper());

        executor.execute(() -> {
            if (db == null)
                return;
            contacts = db.contactCardDao().index();
            handler.post(() -> {
                adapter.setContacts(contacts);
                adapter.notifyDataSetChanged();
            });
        });
    }

}