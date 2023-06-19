package com.example.androidapp.api;

import android.content.Context;

import com.example.androidapp.R;
import com.example.androidapp.api.requests.LoginRequest;
import com.example.androidapp.api.requests.RegisterRequest;
import com.example.androidapp.api.responses.LastMessage;
import com.example.androidapp.api.responses.Message;
import com.example.androidapp.api.responses.RegisterResponse;

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

    int OK_STATUS = 200;

    @Headers({"Content-Type: application/json"})
    @POST("Tokens")
    Call<String> login(@Body LoginRequest request);

    @Headers({"Content-Type: application/json"})
    @POST("Users")
    Call<RegisterResponse> register(@Body RegisterRequest request);

    @Headers({"Content-Type: application/json"})
    @GET("Chats")
    Call<LastMessage[]> lastMessages(@Header("Authorization") String token);

    @Headers({"Content-Type: application/json"})
    @GET("Chats/{id}/Messages")
    Call<Message[]> getMessages(@Path("id") int id);

    static Retrofit createRetrofit(Context context) {
        return new Retrofit.Builder()
                .baseUrl(context.getString(R.string.BaseUrl))
                .addConverterFactory(ScalarsConverterFactory.create())
                .addConverterFactory(GsonConverterFactory.create())
                .build();
    }

    static ChatAppAPI createAPI(Context context) {
        return createRetrofit(context).create(ChatAppAPI.class);
    }

}
