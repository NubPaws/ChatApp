package com.example.androidapp.api;

import android.content.Context;
import android.content.SharedPreferences;

import com.example.androidapp.R;
import com.example.androidapp.api.requests.AddContactRequest;
import com.example.androidapp.api.requests.LoginRequest;
import com.example.androidapp.api.requests.RegisterRequest;
import com.example.androidapp.api.requests.SendMessageRequest;
import com.example.androidapp.api.responses.LastMessageResponse;
import com.example.androidapp.api.responses.MessageResponse;
import com.example.androidapp.api.responses.RegisterResponse;
import com.example.androidapp.api.responses.SendMessageResponse;

import retrofit2.Call;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.converter.scalars.ScalarsConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.Headers;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ChatAppAPI {

    @Headers({"Content-Type: application/json"})
    @POST("Tokens")
    Call<String> login(@Body LoginRequest request);

    @Headers({"Content-Type: application/json"})
    @POST("Tokens")
    Call<String> login(@Header("fcmToken") String fcmToken, @Body LoginRequest request);

    @Headers({"Content-Type: application/json"})
    @POST("Users")
    Call<RegisterResponse> register(@Body RegisterRequest request);

    @Headers({"Content-Type: application/json"})
    @GET("Chats")
    Call<LastMessageResponse[]> lastMessages(@Header("Authorization") String token);

    @Headers({"Content-Type: application/json"})
    @GET("Chats/{id}/Messages")
    Call<MessageResponse[]> getMessages(@Header("Authorization") String token, @Path("id") int id);

    @Headers({"Content-Type: application/json"})
    @POST("Chats/{id}/Messages")
    Call<SendMessageResponse> sendMessage(
            @Header("Authorization") String token, @Path("id") int id, @Body SendMessageRequest msg
    );

    @Headers({"Content-Type: application/json"})
    @POST("Chats/")
    Call<Void> addContact(@Header("Authorization") String token, @Body AddContactRequest req);

    static Retrofit createRetrofit(Context context) {

        SharedPreferences sharedPref = context.getSharedPreferences(
                context.getString(R.string.preference_file_key), Context.MODE_PRIVATE);

        String defaultBaseUrl = context.getResources().getString(R.string.DefaultBaseUrl);
        String baseUrl = sharedPref.getString(context.getString(R.string.BaseUrl), defaultBaseUrl);

        return new Retrofit.Builder()
                .baseUrl(baseUrl)
                .addConverterFactory(ScalarsConverterFactory.create())
                .addConverterFactory(GsonConverterFactory.create())
                .build();
    }

    static ChatAppAPI createAPI(Context context) {
        return createRetrofit(context).create(ChatAppAPI.class);
    }

}
