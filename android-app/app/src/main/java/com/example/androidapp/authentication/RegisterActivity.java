package com.example.androidapp.authentication;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Base64;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import com.example.androidapp.R;
import com.example.androidapp.api.ChatAppAPI;
import com.example.androidapp.api.requests.RegisterRequest;
import com.example.androidapp.api.responses.RegisterResponse;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class RegisterActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        ImageView imPreviewPicture = findViewById(R.id.imPreviewPicture);

        ActivityResultLauncher<Intent> imagePickerActivity = registerForActivityResult(
                new ActivityResultContracts.StartActivityForResult(),
                result -> {
                    if (result.getResultCode() == Activity.RESULT_OK) {
                        Intent data = result.getData();
                        if (data != null && data.getData() != null) {
                            Uri selectedImageUri = data.getData();
                            Bitmap selectedImageBitmap = null;
                            try {
                                selectedImageBitmap = MediaStore.Images.Media.getBitmap(
                                        this.getContentResolver(),
                                        selectedImageUri);
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                            imPreviewPicture.setImageBitmap(selectedImageBitmap);
                        }
                    }
                });

        Button btnSelectPicture = findViewById(R.id.btnSelectPicture);
        btnSelectPicture.setOnClickListener(view -> {
            Intent intent = new Intent();
            intent.setType("image/*");
            intent.setAction(Intent.ACTION_GET_CONTENT);
            imagePickerActivity.launch(intent);
        });

        Button btnRegister = findViewById(R.id.btnRegister);
        btnRegister.setOnClickListener(view -> {
            EditText etUsername = findViewById(R.id.etUsername);
            EditText etPassword = findViewById(R.id.etPassword);
            EditText etConfirmPassword = findViewById(R.id.etConfirmPassword);
            EditText etDisplayName = findViewById(R.id.etDisplayName);

            if (Validation.validateUsername(etUsername)
                    && Validation.validatePassword(etPassword)
                    && Validation.validatePassword(etConfirmPassword)
                    && Validation.confirmPasswordsMatch(etPassword, etConfirmPassword) &&
                    Validation.validateDisplayName(etDisplayName)
                    && Validation.validateProfilePicture(imPreviewPicture, this.getApplicationContext())) {
                Retrofit retrofit = new Retrofit.Builder()
                        .baseUrl(this.getApplicationContext().getString(R.string.BaseUrl))
                        .addConverterFactory(GsonConverterFactory.create())
                        .build();
                ChatAppAPI api = retrofit.create(ChatAppAPI.class);

                ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
                Bitmap bitmap = ((BitmapDrawable) imPreviewPicture.getDrawable()).getBitmap();
                bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
                byte[] imageBytes = byteArrayOutputStream.toByteArray();
                String imageString = Base64.encodeToString(imageBytes, Base64.DEFAULT);
                String fullImageUri = "data:image/jpeg;base64," + imageString;

                Call<RegisterResponse> registerAttempt = api.register(
                        new RegisterRequest(etUsername.getText().toString(),
                                etPassword.getText().toString(),
                                etDisplayName.getText().toString(),
                                fullImageUri));

                registerAttempt.enqueue(new Callback<RegisterResponse>() {
                    @Override
                    public void onResponse(@NonNull Call<RegisterResponse> call, @NonNull Response<RegisterResponse> response) {
                        CharSequence text;
                        int duration = Toast.LENGTH_SHORT;
                        Toast toast;

                        if (response.code() == 200) {
                            RegisterResponse userDate = response.body();
                            text = "Successfully registered";
                            toast = Toast.makeText(getApplicationContext(), text, duration);
                            toast.show();
                            finish();
                        } else {
                            text = "Error while trying to register";
                            toast = Toast.makeText(getApplicationContext(), text, duration);
                            toast.show();
                        }
                    }

                    @Override
                    public void onFailure(@NonNull Call<RegisterResponse> call, @NonNull Throwable t) {
                        t.printStackTrace();
                    }
                });

            }
        });
    }
}