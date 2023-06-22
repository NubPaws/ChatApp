package com.example.androidapp.authentication;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.example.androidapp.R;
import com.example.androidapp.api.ChatAppAPI;
import com.example.androidapp.api.requests.LoginRequest;
import com.example.androidapp.chats.contacts.ContactListActivity;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {

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
        btnLogin.setOnClickListener(view -> {
            if (Validation.validateUsername(etLoginUsername) && Validation.validatePassword(etLoginPassword)) {
                ChatAppAPI api = ChatAppAPI.createAPI(getApplicationContext());

                Call<String> loginAttempt = api.login(new LoginRequest(etLoginUsername.getText().toString(),
                        etLoginPassword.getText().toString()));

                loginAttempt.enqueue(new LoginResponseHandler());
            }
        });
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

        this.startActivity(intent);
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