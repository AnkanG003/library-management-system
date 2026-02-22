package com.library.management.controller;

import com.library.management.dto.auth.JwtResponse;
import com.library.management.dto.auth.LoginRequest;
import com.library.management.dto.auth.RegisterRequest;
import com.library.management.model.User;
import com.library.management.security.JwtService;
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

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        User user = userService.register(request);

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
        String token = jwtService.generateToken(userDetails);

        return  ResponseEntity.ok(
                new JwtResponse(
                        token,
                        user.getUsername(),
                        user.getRole()));
    }

}

