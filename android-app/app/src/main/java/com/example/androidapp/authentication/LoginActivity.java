package com.example.androidapp.authentication;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.example.androidapp.R;
import com.example.androidapp.api.ChatAppAPI;
import com.example.androidapp.api.requests.LoginRequest;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.converter.scalars.ScalarsConverterFactory;

public class LoginActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        TextView tvSignUp = findViewById(R.id.tvSignUp);
        tvSignUp.setOnClickListener(view -> {
            Intent intent = new Intent(this, RegisterActivity.class);
            startActivity(intent);
        });


        Button btnLogin = findViewById(R.id.btnLogin);
        btnLogin.setOnClickListener(view -> {
            EditText etLoginUsername = findViewById(R.id.etLoginUsername);
            EditText etLoginPassword = findViewById(R.id.etLoginPassword);
            if (Validation.validateUsername(etLoginUsername) && Validation.validatePassword(etLoginPassword)) {
                Retrofit retrofit = new Retrofit.Builder()
                        .baseUrl(this.getApplicationContext().getString(R.string.BaseUrl))
                        .addConverterFactory(ScalarsConverterFactory.create())
                        .addConverterFactory(GsonConverterFactory.create())
                        .build();
                ChatAppAPI api = retrofit.create(ChatAppAPI.class);

                Call<String> loginAttempt = api.login(new LoginRequest(etLoginUsername.getText().toString(),
                        etLoginPassword.getText().toString()));

                loginAttempt.enqueue(new Callback<String>() {
                    @Override
                    public void onResponse(@NonNull Call<String> call, @NonNull Response<String> response) {
                        int duration = Toast.LENGTH_SHORT;
                        CharSequence text;
                        Toast toast;

                        if (response.code() == 200) {
                            String jwt = response.body();
                            text = "Successfully logged in";
                            toast = Toast.makeText(getApplicationContext(), text, duration);
                            toast.show();


                        } else {
                            text = "Error while trying to login";

                            toast = Toast.makeText(getApplicationContext(), text, duration);
                            toast.show();
                        }

                    }

                    @Override
                    public void onFailure(@NonNull Call<String> call, @NonNull Throwable t) {
                        t.printStackTrace();
                    }
                });

            }
        });
    }
}