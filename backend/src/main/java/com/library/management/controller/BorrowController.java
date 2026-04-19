package com.library.management.controller;

import com.library.management.dto.borrow.BorrowRecordResponse;
import com.library.management.model.BorrowRecord;
import com.library.management.service.BorrowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;


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


    @PostMapping("/admin/return/{transactionId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminReturnBook(@PathVariable Long transactionId) {
        borrowService.returnBookByAdmin(transactionId);
        // Return a Map so it converts to {"message": "..."}
        return ResponseEntity.ok(Collections.singletonMap("message", "Book returned successfully"));
    }



    @GetMapping("/my-loans")
    @PreAuthorize("hasRole('MEMBER')") // Only members need to see their personal loans
    public ResponseEntity<List<BorrowRecord>> getMyLoans() {
        return ResponseEntity.ok(borrowService.getMyActiveLoans());
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BorrowRecordResponse>> getAllTransactions() {
        List<BorrowRecordResponse> transactions = borrowService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }
}
