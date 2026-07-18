package com.library.management.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.access.expiration}")
    private long accessTokenExpiration;

    @Value("${jwt.refresh.expiration}")
    private long refreshTokenExpiration;

    private Key getSigningKey(){
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateAccessToken(UserDetails userDetails) {

        Map<String, Object> claims = new HashMap<>();

        claims.put(
                "role",
                userDetails.getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority()
        );

        return buildToken(userDetails, claims, accessTokenExpiration);
    }

    public String generateRefreshToken(UserDetails userDetails) {

        return buildToken(
                userDetails,
                new HashMap<>(),
                refreshTokenExpiration
        );
    }

    private String buildToken(
            UserDetails userDetails,
            Map<String, Object> claims,
            long expiration
    ) {

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + expiration)
                )
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    public String extractRole(String token){
        return extractAllClaims(token).get("role",String.class);
    }

    public String extractUsername(String token){
        return extractAllClaims(token).getSubject();
    }

    private Claims extractAllClaims(String token) {

        return  Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public boolean isTokenValid(
            String token,
            UserDetails userDetails
    ) {

        try {

            String username = extractUsername(token);

            return username.equals(userDetails.getUsername());

        } catch (Exception e) {

            return false;

        }
    }

    public Instant getRefreshTokenExpiry() {
        return Instant.now().plusMillis(refreshTokenExpiration);
    }
}
