package com.example.androidapp.authentication;

import android.content.Context;
import android.text.TextUtils;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Toast;

public class Validation {

    public static boolean validateUsername(EditText username) {
        int MIN_USERNAME_LENGTH = 4;
        if (username.getText().toString().length() < MIN_USERNAME_LENGTH) {
            username.setError("Username needs to have at least 4 characters");
            return false;
        }
        return true;
    }

    public static boolean validatePassword(EditText password) {
        int MIN_PASSWORD_LENGTH = 8;
        if (password.getText().toString().length() < MIN_PASSWORD_LENGTH) {
            password.setError("Password needs have at least 8 characters");
            return false;
        }
        return true;
    }

    public static boolean confirmPasswordsMatch(EditText password, EditText confirmPassword) {
        if (!confirmPassword.getText().toString().equals(password.getText().toString())) {
            confirmPassword.setError("Passwords do not match");
            return false;
        }
        return true;
    }

    public static boolean validateDisplayName(EditText displayName) {
        if (TextUtils.isEmpty(displayName.getText())) {
            displayName.setError("Display Name can't be empty");
            return false;
        }
        return true;
    }

    public static boolean validateProfilePicture(ImageView profilePicture, Context context) {
        if (profilePicture.getDrawable() == null) {
            CharSequence text = "Image is required";
            int duration = Toast.LENGTH_SHORT;

            Toast toast = Toast.makeText(context, text, duration);
            toast.show();
            return false;
        }
        return true;
    }
}
