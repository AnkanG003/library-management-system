package com.library.management.dto.auth;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
}
