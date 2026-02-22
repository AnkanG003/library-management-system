package com.library.management.controller;

import com.library.management.model.Book;
import com.library.management.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    // BOTH USER and ADMIN can view books
    @GetMapping
    @PreAuthorize("hasAnyRole('MEMBER','ADMIN')")
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    // BOTH USER and ADMIN can view a specific book
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('MEMBER','ADMIN')")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    // ONLY ADMIN can add book
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> addBook(@RequestBody Book book) {
        return ResponseEntity.ok(bookService.addBook(book));
    }

    // ONLY ADMIN can update
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Book> updateBook(@PathVariable Long id,
                                           @RequestBody Book book) {
        return ResponseEntity.ok(bookService.updateBook(id, book));
    }

    // ONLY ADMIN can delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok("Book deleted successfully");
    }
}