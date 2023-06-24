package com.example.androidapp.authentication;

import static com.example.androidapp.authentication.Validation.validateRegister;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import com.example.androidapp.R;
import com.example.androidapp.api.ChatAppAPI;
import com.example.androidapp.api.requests.RegisterRequest;
import com.example.androidapp.api.responses.RegisterResponse;
import com.example.androidapp.settings.SettingsActivity;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

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
                            try (InputStream inputStream = getContentResolver().openInputStream(selectedImageUri)) {
                                selectedImageBitmap = BitmapFactory.decodeStream(inputStream);
                            } catch (IOException e) {
                                Log.e("IOException convert to bitmap", e.toString());
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

            boolean isRegisterValid = validateRegister(etUsername, etPassword, etConfirmPassword,
                    etDisplayName, imPreviewPicture, getApplicationContext());
            if (isRegisterValid) {
                ChatAppAPI api = ChatAppAPI.createAPI(getApplicationContext());

                String fullImageUri = generateFullImageUri(imPreviewPicture);

                Call<RegisterResponse> registerAttempt = api.register(
                        new RegisterRequest(etUsername.getText().toString(),
                                etPassword.getText().toString(),
                                etDisplayName.getText().toString(),
                                fullImageUri));

                registerAttempt.enqueue(new RegisterResponseHandler());
            }
        });

        Button btnSettingsFromRegister = findViewById(R.id.btnSettingsFromRegister);
        btnSettingsFromRegister.setOnClickListener(view -> {
            Intent intent = new Intent(this, SettingsActivity.class);
            startActivity(intent);
        });
    }

    private String generateFullImageUri(ImageView imageView) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Bitmap bitmap = ((BitmapDrawable) imageView.getDrawable()).getBitmap();
        bitmap.compress(Bitmap.CompressFormat.JPEG, 100, byteArrayOutputStream);
        byte[] imageBytes = byteArrayOutputStream.toByteArray();
        String imageString = Base64.encodeToString(imageBytes, Base64.DEFAULT);
        return "data:image/jpeg;base64," + imageString;
    }

    public class RegisterResponseHandler implements Callback<RegisterResponse> {
        @Override
        public void onResponse(@NonNull Call<RegisterResponse> call, @NonNull Response<RegisterResponse> response) {
            if (response.code() == 200) {
                Toast.makeText(RegisterActivity.this, "Successfully registered", Toast.LENGTH_SHORT).show();
                finish();
            } else {
                Toast.makeText(RegisterActivity.this, "Error while trying to register", Toast.LENGTH_SHORT).show();
            }
        }

        @Override
        public void onFailure(@NonNull Call<RegisterResponse> call, @NonNull Throwable t) {
            t.printStackTrace();
        }
    }

}