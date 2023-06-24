package com.example.androidapp.settings;

import static androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_NO;
import static androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_YES;
import static androidx.appcompat.app.AppCompatDelegate.MODE_NIGHT_UNSPECIFIED;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.RadioButton;

import com.example.androidapp.R;

public class SettingsActivity extends AppCompatActivity {

    private EditText etServerAddress;

    private RadioButton rbLight;
    private RadioButton rbDark;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings);

        etServerAddress = findViewById(R.id.etServerAddress);

        int mode = AppCompatDelegate.getDefaultNightMode();

        rbLight = findViewById(R.id.rbLight);
        rbDark = findViewById(R.id.rbDark);

        if (mode == MODE_NIGHT_NO || mode == MODE_NIGHT_UNSPECIFIED)
            rbLight.toggle();
        if (mode == MODE_NIGHT_YES)
            rbDark.toggle();

        Button backButton = findViewById(R.id.settings_back_btn);
        backButton.setOnClickListener(this::onApplyButtonClick);
    }

    private void onThemeSelected() {
        if (rbLight.isChecked()) {
            AppCompatDelegate.setDefaultNightMode(MODE_NIGHT_NO);
        } else {
            AppCompatDelegate.setDefaultNightMode(MODE_NIGHT_YES);
        }
    }

    private void btnSelectAddressClick() {
        SharedPreferences sharedPref = this.getSharedPreferences(
                getString(R.string.preference_file_key),
                MODE_PRIVATE);

        // Adding the /api to the address
        String url = etServerAddress.getText().toString();
        if (url.isEmpty()) {
            return;
        }

        if (url.endsWith("/")) {
            url = url.substring(0, url.length() - 1);
        }

        url += getString(R.string.ApiPath);
        sharedPref.edit()
                .putString(getString(R.string.BaseUrl), url)
                .apply();
    }

    private void onApplyButtonClick(View v) {
        btnSelectAddressClick();
        onThemeSelected();

        finish();
    }

}