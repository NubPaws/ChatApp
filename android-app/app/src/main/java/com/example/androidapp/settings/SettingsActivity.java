package com.example.androidapp.settings;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;

import com.example.androidapp.R;
import com.example.androidapp.authentication.LoginActivity;

public class SettingsActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);

        EditText etServerAddress = findViewById(R.id.etServerAddress);

        Button btnSelectAddress = findViewById(R.id.btnSelectAddress);
        btnSelectAddress.setOnClickListener(view -> {
            SharedPreferences sharedPref = this.getSharedPreferences(
                    getString(R.string.preference_file_key),
                    Context.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPref.edit();

            // Adding the /api to the address
            String url = etServerAddress.getText().toString();
            if (url.endsWith("/")) {
                url = url.substring(0, url.length() - 1);
            }

            url += getString(R.string.ApiPath);
            editor.putString(getString(R.string.BaseUrl), url);
            editor.apply();
        });
    }

    public void onThemeSelected(View view) {
        boolean checked = ((RadioButton) view).isChecked();

        if (view.getId() == R.id.rbLight && checked) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO);
        } else if (view.getId() == R.id.rbDark && checked) {
            AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES);
        }
    }
}