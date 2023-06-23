package com.example.androidapp.authentication;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.example.androidapp.R;
import com.example.androidapp.api.ChatAppAPI;
import com.example.androidapp.api.requests.LoginRequest;
import com.example.androidapp.chats.contacts.ContactListActivity;
import com.example.androidapp.connectivity.ChatMessagesService;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.messaging.FirebaseMessaging;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity implements View.OnClickListener {

    private EditText etLoginUsername;
    private EditText etLoginPassword;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        checkUserAlreadyLoggedIn();

        TextView tvSignUp = findViewById(R.id.tvSignUp);
        tvSignUp.setOnClickListener(view -> {
            Intent intent = new Intent(this, RegisterActivity.class);
            startActivity(intent);
        });

        etLoginUsername = findViewById(R.id.etLoginUsername);
        etLoginPassword = findViewById(R.id.etLoginPassword);

        Button btnLogin = findViewById(R.id.btnLogin);
        btnLogin.setOnClickListener(this);
    }

    private void checkUserAlreadyLoggedIn() {
        SharedPreferences preferences = getSharedPreferences(
                getString(R.string.shared_prefs_name), Context.MODE_PRIVATE
        );

        boolean isLoggedIn = preferences.getBoolean(getString(R.string.logged_in_key), false);
        if (!isLoggedIn) {
            return;
        }

        final String usernameKey = getString(R.string.username_key);
        final String jwtTokenKey = getString(R.string.jwt_token_key);

        String username = preferences.getString(usernameKey, "");
        String jwtToken = preferences.getString(jwtTokenKey, "");

        Intent intent = new Intent(this, ContactListActivity.class);
        intent.putExtra(usernameKey, username);
        intent.putExtra(jwtTokenKey, jwtToken);
        startActivity(intent);
    }

    private void saveLoginInformation(String username, String fullToken) {
        // Store the data on file (where no raccoon can get it).
        SharedPreferences.Editor editor = getSharedPreferences(
                getString(R.string.shared_prefs_name), Context.MODE_PRIVATE
        ).edit();
        editor.putBoolean(getString(R.string.logged_in_key), true);
        editor.putString(getString(R.string.username_key), username);
        editor.putString(getString(R.string.jwt_token_key), fullToken);
        editor.apply();
    }

    private void successfulLogin(String jwtToken) {
        final String jwtTokenKey = getString(R.string.jwt_token_key);
        final String usernameKey = getString(R.string.username_key);

        final String fullToken = "bearer " + jwtToken;
        final String username = etLoginUsername.getText().toString();

        saveLoginInformation(username, fullToken);

        // Load the payload, make sure no raccoons are near by.
        Intent intent = new Intent(this, ContactListActivity.class);
        intent.putExtra(jwtTokenKey, fullToken);
        intent.putExtra(usernameKey, username);

        startActivity(intent);
    }

    @Override
    protected void onResume() {
        super.onResume();

        SharedPreferences.Editor editor = getSharedPreferences(
                getString(R.string.shared_prefs_name), Context.MODE_PRIVATE
        ).edit();

        editor.putBoolean(getString(R.string.logged_in_key), false);

        editor.apply();
    }

    @Override
    public void onClick(View v) {
        if (!Validation.validateUsername(etLoginUsername) || !Validation.validatePassword(etLoginPassword)) {
            Toast.makeText(this, "Invalid username and/or password", Toast.LENGTH_SHORT).show();
            return;
        }

        // Create the api and do the api request.
        final String username = etLoginUsername.getText().toString();
        final String password = etLoginPassword.getText().toString();

        // Firebase Cloud Messaging token.
        SharedPreferences prefs = getSharedPreferences(getString(R.string.shared_prefs_name), MODE_PRIVATE);
        final String fcmToken = prefs.getString(getString(R.string.fcm_token_key), "");

        ChatAppAPI api = ChatAppAPI.createAPI(getApplicationContext());
        Call<String> loginAttempt = api.login(fcmToken, new LoginRequest(username, password));
        loginAttempt.enqueue(new LoginResponseHandler());
    }

    public class LoginResponseHandler implements Callback<String> {

        @Override
        public void onResponse(@NonNull Call<String> call, Response<String> response) {
            if (response.isSuccessful()) {
                String jwt = response.body();
                Toast.makeText(LoginActivity.this, "Successfully logged in", Toast.LENGTH_SHORT).show();
                successfulLogin(jwt);
            } else {
                Toast.makeText(LoginActivity.this, "Error while trying to login", Toast.LENGTH_SHORT).show();
            }
        }

        @Override
        public void onFailure(@NonNull Call<String> call, @NonNull Throwable t) {
            t.printStackTrace();
        }
    }

}

/*
A raccoon walks into a cat bar.
The bartender tells the raccoon "You're not welcomed here, this place is only for cats".
The raccoon response "When you think about it I am a cat".
Bartender: "Home come?"
Raccoon: "Well I got 4 feet, I'm cute, I like eating and when I am out and about I tend to visit the local dumpster
    for some decent dinner"
Bartender: "Hmm... you got a point. In that case what would you like to order?"
Raccoon: "I dunno, got any garbage liquor?"

No one knows how this story ended, as the raccoons shortly after tried controlling the world.
That's why we make sure there are no raccoons nearby when we are preparing the payload.
Cats are way better anyways!
*/
