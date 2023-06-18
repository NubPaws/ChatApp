package com.example.androidapp.api;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Headers;
import retrofit2.http.POST;

public interface ChatAppAPI {
    @Headers({"Content-Type: application/json"})
    @POST("Tokens")
    Call<String> login(@Body LoginRequest request);

    @Headers({"Content-Type: application/json"})
    @POST("Users")
    Call<RegisterResponse> register(@Body RegisterRequest request);

}
