package com.library.management.controller;

import com.library.management.service.BorrowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/borrow")
@RequiredArgsConstructor
public class BorrowController {

    private final BorrowService borrowService;

    @PostMapping("/{bookId}")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<String> borrowBook(@PathVariable Long bookId){
        return ResponseEntity.ok(borrowService.borrowBook(bookId));
    }

    @PostMapping("/return/{bookId}")
    @PreAuthorize("hasRole('MEMBER')")
    public ResponseEntity<String> returnBook(@PathVariable Long bookId){
        return ResponseEntity.ok(borrowService.returnBook(bookId));
    }
}
