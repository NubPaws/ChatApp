package com.example.androidapp.authentication;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

import com.example.androidapp.R;

import java.io.IOException;


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

            }
        });
    }
}