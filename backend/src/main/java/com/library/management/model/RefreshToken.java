package com.library.management.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import org.springframework.boot.autoconfigure.web.WebProperties;

import java.time.Instant;


@Builder
@Entity
@Getter

public class RefreshToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    private Instant expiryDate;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
