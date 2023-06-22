package com.example.androidapp.authentication;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.example.androidapp.MainActivity;
import com.example.androidapp.R;
import com.example.androidapp.api.ChatAppAPI;
import com.example.androidapp.api.requests.LoginRequest;
import com.example.androidapp.chats.contacts.ContactListActivity;
import com.example.androidapp.settings.SettingsActivity;

import org.jetbrains.annotations.NotNull;

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

        Button btnSettingsFromLogin = findViewById(R.id.btnSettingsFromLogin);
        btnSettingsFromLogin.setOnClickListener(view -> {
            Intent intent = new Intent(this, SettingsActivity.class);
            startActivity(intent);
        });
    }

    private void successfulLogin(String jwtToken) {
        Intent intent = new Intent(this, ContactListActivity.class);

        // Load the payload, make sure no raccoons are near by.
        intent.putExtra(MainActivity.JWT_TOKEN_KEY, "bearer " + jwtToken);
        intent.putExtra(MainActivity.USERNAME_KEY, etLoginUsername.getText().toString());

        this.startActivity(intent);
    }

    public class LoginResponseHandler implements Callback<String> {

        @Override
        public void onResponse(@NonNull Call<String> call, Response<String> response) {
            if (response.code() == 200) {
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