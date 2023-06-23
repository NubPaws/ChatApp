package com.example.androidapp.chats.contacts;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.lifecycle.Observer;
import androidx.lifecycle.ViewModelProvider;
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

import com.example.androidapp.R;
import com.example.androidapp.api.ChatAppAPI;
import com.example.androidapp.api.responses.LastMessageResponse;
import com.example.androidapp.chats.database.ChatViewModel;
import com.example.androidapp.chats.messages.ChatActivity;
import com.example.androidapp.chats.database.entities.ContactCard;
import com.example.androidapp.chats.database.AppDB;
import com.example.androidapp.chats.database.dao.ContactCardDao;
import com.example.androidapp.chats.database.entities.User;
import com.example.androidapp.utils.PushNotificationsHandler;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ContactListActivity extends AppCompatActivity
        implements AbsListView.OnScrollListener, AdapterView.OnItemClickListener,
        SwipeRefreshLayout.OnRefreshListener, Observer<List<ContactCard>> {

    private String jwtToken;
    private String username;

    private PushNotificationsHandler notifications;

    private AppDB db;
    private ChatViewModel chatViewModel;
    private ContactsAdapter adapter;
    private FloatingActionButton fab;
    private SwipeRefreshLayout swiper;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_contact_list);

        // Get that sweet sweet JWT token as we love it.
        Intent intent = getIntent();
        jwtToken = intent.getStringExtra(getString(R.string.jwt_token_key));
        username = intent.getStringExtra(getString(R.string.username_key));

        notifications = new PushNotificationsHandler(this, "push_id", "Chat App Push Notifications");
        if (notifications.needPermissions())
            notifications.requestNotificationPermission(this);

        chatViewModel = new ViewModelProvider(this).get(ChatViewModel.class);
        chatViewModel.getContacts().observe(this, this);

        // Make our contact list updatable.
        swiper = findViewById(R.id.swiper_layout);
        swiper.setOnRefreshListener(this);

        // Build the Room Database
        db = AppDB.create(getApplicationContext());

        // Make sure to init the fab before the contact list view.
        initAddContactFAB();

        // Setup the contacts list view with all of our fancy listeners.
        ListView contactListView = findViewById(R.id.contact_list_view);
        contactListView.setOnItemClickListener(this);
        contactListView.setOnScrollListener(this);

        // Setup the adapter for the list view. Now we can just update the adapter.
        adapter = new ContactsAdapter(new ArrayList<>());
        contactListView.setAdapter(adapter);

        loadContacts();

        // Make the back button work :D.
        ImageButton backBtn = findViewById(R.id.contact_list_back_button);
        backBtn.setOnClickListener(new HandleLogout());
    }

    private void initAddContactFAB() {
        // The contact list view's scroll listener will be using the fab so we want to
        // have it created already.
        fab = findViewById(R.id.contact_add_btn);
        fab.setOnClickListener(v -> {
            Intent intent = new Intent(this, AddContactActivity.class);
            intent.putExtra(getString(R.string.jwt_token_key), jwtToken);
            startActivity(intent);
        });
    }

    /**
     * Loads the contacts from the local storage and then starts loading them from the server.
     * First the function shows the list of contacts that are already available, then the function
     * loads and then displays the updated contacts.
     */
    private void loadContacts() {
        swiper.setRefreshing(true);

        Executors.newSingleThreadExecutor().execute(() -> {
            checkToDeleteUserTable();

            // Load the contacts from the dao.
            List<ContactCard> cards = db.contactCardDao().index();
            adapter.setContacts(cards);

            // Load the contacts from the backend.
            // Do the API call.
            ChatAppAPI api = ChatAppAPI.createAPI(getApplicationContext());
            api.lastMessages(jwtToken).enqueue(new LastMessageResponseHandler());
        });
    }

    /**
     * Checks whether to delete the user table and all of the other data that we
     * have stored on the user locally (like credit card details and such).
     * If a new user has connected we will delete all of the previous data, otherwise
     * the data stays and no deletion is done. Just updating the user's jwtToken.
     */
    private synchronized void checkToDeleteUserTable() {
        User user = db.userDao().getUser();
        if (user == null) {
            db.userDao().insert(new User(username, jwtToken));
        } else if (!user.getUsername().equals(username)) {
            db.contactCardDao().deleteTable();
            db.userDao().deleteTable();
            db.chatMessageDao().deleteTable();
            db.userDao().insert(new User(username, jwtToken));
        } else {
            user.setToken(jwtToken);
            db.userDao().update(user);
        }
    }

    private void addContactCardResponseToList(LastMessageResponse[] lastMessages) {
        ExecutorService executor = Executors.newSingleThreadExecutor();
        Handler handler = new Handler(Looper.getMainLooper());

        executor.execute(() -> {
            List<ContactCard> cards = new ArrayList<>();
            for (LastMessageResponse msg : lastMessages) {
                String lastMessage = "";
                if (msg.getLastMessage() != null)
                    lastMessage = msg.getLastMessage().getCreated();

                cards.add(new ContactCard(
                        msg.getId(),
                        msg.getUser().getUsername(),
                        msg.getUser().getProfilePic(),
                        msg.getUser().getDisplayName(),
                        lastMessage
                ));
            }

            handler.post(() -> {
                // Can't call setValue on the background thread so do it on the main thread.
                chatViewModel.setContactCards(cards);
                swiper.setRefreshing(false);
            });
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
        ContactCard card = chatViewModel.getContactCard(position);
        if (card == null)
            return;
        Intent intent = new Intent(ContactListActivity.this, ChatActivity.class);

        // Load the payload!
        intent.putExtra(getString(R.string.jwt_token_key), jwtToken);
        intent.putExtra(getString(R.string.chat_id_key), card.getChatId());
        intent.putExtra(getString(R.string.username_key), username);

        // Send 'em away bois!
        startActivity(intent);
    }

    @Override
    public void onRefresh() {
        loadContacts();
    }

    @Override
    protected void onResume() {
        super.onResume();
        loadContacts();
        if (notifications.needPermissions())
            notifications.requestNotificationPermission(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    @Override
    public void onChanged(List<ContactCard> contactCards) {
        // Update the dao.
        Executors.newSingleThreadExecutor().execute(() -> {
            if (db == null)
                return;

            ContactCardDao dao = db.contactCardDao();

            for (ContactCard card : contactCards) {
                ContactCard cc = dao.get(card.getUsername());
                if (cc == null) {
                    dao.insert(card);
                } else {
                    // Update the necessary fields.
                    cc.setLastMessage(cc.getLastMessage());
                    dao.update(cc);
                }
            }
        });

        // Update the list view's adapter.
        adapter.setContacts(contactCards);
        adapter.notifyDataSetChanged();
    }

    private class LastMessageResponseHandler implements Callback<LastMessageResponse[]> {
        @Override
        public void onResponse(@NonNull Call<LastMessageResponse[]> call, Response<LastMessageResponse[]> response) {
            if (!response.isSuccessful()) {
                swiper.setRefreshing(false);
                return;
            }
            LastMessageResponse[] lastMessages = response.body();
            if (lastMessages == null) {
                swiper.setRefreshing(false);
                return;
            }
            addContactCardResponseToList(lastMessages);
        }

        @Override
        public void onFailure(@NonNull Call<LastMessageResponse[]> call, @NonNull Throwable t) {
            Toast.makeText(ContactListActivity.this, "Couldn't connect to server", Toast.LENGTH_SHORT).show();
            swiper.setRefreshing(false);;
        }
    }

    public class HandleLogout implements View.OnClickListener {
        @Override
        public void onClick(View v) {
            AlertDialog.Builder builder = new AlertDialog.Builder(ContactListActivity.this);

            builder.setTitle("Confirm Logout")
                    .setMessage("Are you sure you want to logout?")
                    .setPositiveButton("Confirm", (dialog, which) -> finish())
                    .setNegativeButton("Cancel", (dialog, which) -> {});

            AlertDialog dialog = builder.create();
            dialog.show();
        }
    }

}