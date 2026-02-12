package com.library.management.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class HomeController {
@GetMapping("/info")
public Map<String, String> homeInfo(){
    return Map.of(
            "appName", "Library Management System",
            "stutas", "Backend is running"
    );
}
}
