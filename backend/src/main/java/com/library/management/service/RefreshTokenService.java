package com.library.management.service;

import com.library.management.model.RefreshToken;
import com.library.management.model.User;
import com.library.management.repository.RefreshTokenRepository;
import com.library.management.security.JwtService;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RefreshTokenService{
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

        public RefreshToken createRefreshToken(User user){
            refreshTokenRepository.deleteByUser(user);

            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(user.getUsername());

            String token = jwtService.generateRefreshToken(userDetails);

            RefreshToken refreshToken = RefreshToken.builder()
                    .token(token)
                    .expiryDate(jwtService.getRefreshTokenExpiry())
                    .user(user)
                    .build();

            return refreshTokenRepository.save(refreshToken);
        }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshToken verifyExpiration(RefreshToken refreshToken) {

        if (refreshToken.getExpiryDate().isBefore(Instant.now())) {

            refreshTokenRepository.delete(refreshToken);

            throw new RuntimeException("Refresh token has expired. Please login again.");
        }

        return refreshToken;
    }

    public void deleteByUser(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
}
