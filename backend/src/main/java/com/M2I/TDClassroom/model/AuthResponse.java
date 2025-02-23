package com.M2I.TDClassroom.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AuthResponse {
    private String username;
    private boolean authenticated;
    private String message;
    private String role;


    public AuthResponse(String username, boolean authenticated, String message) {
        this.username = username;
        this.authenticated = authenticated;
        this.message = message;
        this.role = role;

    }


}