package com.example.androidapp.chats.contacts;

import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.widget.AbsListView;
import android.widget.AdapterView;
import android.widget.ImageButton;
import android.widget.ListView;
import android.widget.Toast;

import com.example.androidapp.MainActivity;
import com.example.androidapp.R;
import com.example.androidapp.api.ChatAppAPI;
import com.example.androidapp.api.responses.LastMessage;
import com.example.androidapp.chats.messages.ChatActivity;
import com.example.androidapp.chats.database.entities.ContactCard;
import com.example.androidapp.chats.database.AppDB;
import com.example.androidapp.chats.database.dao.ContactCardDao;
import com.example.androidapp.chats.database.entities.User;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ContactListActivity extends AppCompatActivity
        implements AbsListView.OnScrollListener, AdapterView.OnItemClickListener,
        SwipeRefreshLayout.OnRefreshListener, Callback<LastMessage[]> {

    private String jwtToken;
    private String username;

    private AppDB db;
    private ContactCardDao contactsDao;
    private List<ContactCard> contacts;
    private ContactsAdapter adapter;
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

        // Make our contact list updatable.
        swiper = findViewById(R.id.swiper_layout);
        swiper.setOnRefreshListener(this);

        // Build the Room Database
        db = AppDB.create(getApplicationContext());

        initAddContactFAB();

        loadContacts();

        // Make the back button work :D.
        ImageButton backBtn = findViewById(R.id.contact_list_back_button);
        backBtn.setOnClickListener(v -> finish());
    }

    private void initAddContactFAB() {
        // The contact list view's scroll listener will be using the fab so we want to
        // have it created already.
        fab = findViewById(R.id.contact_add_btn);
        fab.setOnClickListener(v -> {
            startActivity(new Intent(this, AddContactActivity.class));
        });
    }

    /**
     * Loads the contacts from the local storage and then starts loading them from the server.
     * First the function shows the list of contacts that are already available, then the function
     * loads and then displays the updated contacts.
     */
    private void loadContacts() {
        // Setup the contacts' list view.
        // Load the data for the contacts, also load up the adapter.
        ListView contactListView = findViewById(R.id.contact_list_view);

        ExecutorService executor = Executors.newSingleThreadExecutor();
        Handler handler = new Handler(Looper.getMainLooper());

        swiper.setRefreshing(true);
        // Create the db and the contactsDao.
        executor.execute(() -> {
            contactsDao = db.contactCardDao();

            checkToDeleteUserTable();

            // Set the contact list adapter.
            adapter = new ContactsAdapter(contactsDao.index());

            // Load the contacts from the backend.
            ChatAppAPI api = ChatAppAPI.createAPI(getApplicationContext());
            // Do the API call.
            api.lastMessages(jwtToken).enqueue(this);

            // Stop refreshing and set the adapter accordingly.
            handler.post(() ->{
                contactListView.setAdapter(adapter);
            });
        });

        contactListView.setOnItemClickListener(this);
        contactListView.setOnScrollListener(this);
    }

    private void checkToDeleteUserTable() {
        User user = db.userDao().getUser();
        if (user == null) {
            db.userDao().insert(new User(username, jwtToken));
        } else if (!user.getUsername().equals(username)) {
            contactsDao.deleteTable();
            db.userDao().deleteTable();
            db.chatMessageDao().deleteTable();
            db.userDao().insert(new User(username, jwtToken));
        } else {
            user.setToken(jwtToken);
            db.userDao().update(user);
        }
    }

    private void addContactCardResponseToList(LastMessage[] lastMessages) {
        ExecutorService executor = Executors.newSingleThreadExecutor();

        executor.execute(() -> {
            for (LastMessage msg : lastMessages) {
                if (contactsDao.exists(msg.getUser().getUsername())) {
                    ContactCard card = contactsDao.get(msg.getUser().getUsername());
                    card.setLastMessage(msg.getLastMessage().getCreated());
                    contactsDao.update(card);
                } else {
                    ContactCard card = new ContactCard(
                            msg.getId(),
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

        // Load the payload!
        intent.putExtra(MainActivity.JWT_TOKEN_KEY, "token");
        intent.putExtra(MainActivity.CHAT_ID_KEY, cc.getChatId());
        intent.putExtra(MainActivity.USERNAME_KEY, username);

        // Send 'em away bois!
        startActivity(intent);
    }

    @Override
    public void onRefresh() {
        Toast.makeText(this, "Refreshing contact list", Toast.LENGTH_SHORT).show();
        loadContacts();
    }

    @Override
    protected void onResume() {
        super.onResume();
        loadContacts();
    }

    private void updateContactList() {
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

    @Override
    public void onResponse(Call<LastMessage[]> call, Response<LastMessage[]> response) {
        if (response.code() != ChatAppAPI.OK_STATUS) {
            swiper.setRefreshing(false);
            return;
        }
        LastMessage[] lastMessages = response.body();
        if (lastMessages == null) {
            swiper.setRefreshing(false);
            return;
        }
        addContactCardResponseToList(lastMessages);
        updateContactList();
        swiper.setRefreshing(false);
    }

    @Override
    public void onFailure(Call<LastMessage[]> call, Throwable t) {
        Toast.makeText(this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
        swiper.setRefreshing(false);;
    }
}