package com.M2I.TDClassroom.controller;

import com.M2I.TDClassroom.model.AuthRequest;
import com.M2I.TDClassroom.model.AuthResponse;  // New class we'll create
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4201, allowedHeaders = \"*\", allowCredentials = \"true\")")  // Add this for Angular
public class AuthController {

    private final AuthenticationProvider authenticationProvider;

    @Autowired
    public AuthController(AuthenticationProvider authenticationProvider) {
        this.authenticationProvider = authenticationProvider;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest, HttpServletRequest request) {
        try {
            Authentication authentication = authenticationProvider.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Create a session and store authentication
            request.getSession(true);

            // Return user details and token if you're using one
            AuthResponse response = new AuthResponse(
                    authentication.getName(),
                    true,
                    "Login successful"
            );

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(null, false, "Invalid credentials"));
        }
    }
}
