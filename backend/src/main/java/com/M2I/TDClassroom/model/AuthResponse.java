package com.M2I.TDClassroom.model;

public class AuthResponse {
    private String username;
    private boolean authenticated;
    private String message;

    public AuthResponse(String username, boolean authenticated, String message) {
        this.username = username;
        this.authenticated = authenticated;
        this.message = message;
    }

    // Add getters and setters
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public boolean isAuthenticated() { return authenticated; }
    public void setAuthenticated(boolean authenticated) { this.authenticated = authenticated; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}