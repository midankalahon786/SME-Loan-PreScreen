package com.sme.prescreen.controller;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sme.prescreen.domain.entity.User;
import com.sme.prescreen.domain.enums.UserRole;
import com.sme.prescreen.repository.UserRepository;
import com.sme.prescreen.security.JwtUtil;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // --- LOGIN ENDPOINT ---
    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest request) {
        try {
            // authenticate() expects the Principal (username/id) and Credentials (password)
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(), // This now maps to "id" from frontend
                            request.getPassword()
                    )
            );
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid User ID or password");
        }

        // Load user details to generate token
        UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());

        // Find the actual User entity to return extra info if needed (like role)
        // casting to your custom UserDetails implementation if needed, or querying DB
        User user = userRepository.findByUsername(request.getUsername()) // Assuming you have this method
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(userDetails);

        // Return token AND the User object so frontend can store role/name
        return ResponseEntity.ok(new JwtResponse(token, user));
    }

    // --- REGISTER ENDPOINT ---
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Error: Email is already in use!"));
        }

        long count = userRepository.count() + 1;
        String generatedId = request.getRole().name() + "-" + count;

        User newUser = User.builder()
                .username(generatedId)
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();

        userRepository.save(newUser);

        // RETURN JSON instead of simple string
        return ResponseEntity.ok(java.util.Map.of(
                "message", "User registered successfully!",
                "userId", generatedId
        ));
    }

    @PostMapping("/forgot-id")
    public ResponseEntity<?> getUserIdByEmail(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No user found with this email."));

        // In a real production app, you would email this.
        // For Capstone/Demo, returning it in the response is acceptable.
        return ResponseEntity.ok(java.util.Map.of(
                "message", "User found",
                "userId", user.getUsername(),
                "fullName", user.getFullName()
        ));
    }

    // --- DTO Classes ---

    @Data
    public static class JwtRequest {
        // MATCHING FRONTEND: The React app sends "id", so we map it to "username" here
        @JsonProperty("id")
        private String username;
        private String password;
    }

    @Data
    @AllArgsConstructor
    public static class JwtResponse {
        private String token;
        private User user; // Return full user details to frontend
    }

    @Data
    public static class RegisterRequest {
        private String fullName;
        private String email;
        private String password;
        private UserRole role; // e.g., APPLICANT or STAFF
    }
}