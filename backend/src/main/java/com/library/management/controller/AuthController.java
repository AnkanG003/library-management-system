package com.library.management.controller;

import com.library.management.dto.auth.*;
import com.library.management.model.RefreshToken;
import com.library.management.model.User;
import com.library.management.security.JwtService;
import com.library.management.service.RefreshTokenService;
import com.library.management.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        User user = userService.register(request);
        System.out.println(user);
        return ResponseEntity.ok("User registered with id: " + user.getId());
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody LoginRequest request) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                request.getUsername(),
                                request.getPassword()
                        )
                );

        String username = authentication.getName();


        User user = userService.findByUsername(username);


        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        String accessToken = jwtService.generateAccessToken(userDetails);
        RefreshToken refreshToken =
                refreshTokenService.createRefreshToken(user);

        return  ResponseEntity.ok(
                new JwtResponse(
                        accessToken,
                        refreshToken.getToken(),
                        user.getUsername(),
                        user.getRole()));
    }

    @PostMapping("/refresh")
    public ResponseEntity<JwtResponse> refreshToken(
            @RequestBody RefreshTokenRequest request) {

        // Find refresh token in database
        RefreshToken refreshToken = refreshTokenService
                .findByToken(request.getRefreshToken())
                .orElseThrow(() ->
                        new RuntimeException("Refresh token not found"));

        // Check expiration
        refreshTokenService.verifyExpiration(refreshToken);

        // Load user
        User user = refreshToken.getUser();

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(user.getUsername());

        // Validate JWT
        if (!jwtService.isTokenValid(
                request.getRefreshToken(),
                userDetails)) {

            throw new RuntimeException("Invalid refresh token");
        }

        // Generate new access token
        String accessToken =
                jwtService.generateAccessToken(userDetails);

        return ResponseEntity.ok(
                new JwtResponse(
                        accessToken,
                        refreshToken.getToken(),
                        user.getUsername(),
                        user.getRole()
                )
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody LogoutRequest request) {

        RefreshToken refreshToken = refreshTokenService
                .findByToken(request.getRefreshToken())
                .orElseThrow(() ->
                        new RuntimeException("Refresh token not found"));

        refreshTokenService.deleteByUser(refreshToken.getUser());

        return ResponseEntity.ok("Logged out successfully.");
    }


}

