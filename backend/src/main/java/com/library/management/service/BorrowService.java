package com.library.management.service;

import com.library.management.model.Book;
import com.library.management.model.BorrowRecord;
import com.library.management.model.BorrowStatus;
import com.library.management.model.User;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class BorrowService {

    private final BorrowRecordRepository borrowRecordRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public String borrowBook(Long bookId) {
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book Not found"));

        boolean alreadyBorrowed =
                borrowRecordRepository.existsByUserAndBookIdAndStatus(
                        user, bookId, BorrowStatus.ISSUED
                );

        if (alreadyBorrowed) {
            return "You already borrowed this book";
        }


        if (book.getAvailableCopies() <= 0) {
            return "Book is not available";
        }

        // reduce available copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);


        BorrowRecord record = BorrowRecord.builder()
                .user(user)
                .book(book)
                .issueDate(LocalDate.now())
                .dueDate(LocalDate.now().plusDays(7))
                .status(BorrowStatus.ISSUED)
                .build();

        borrowRecordRepository.save(record);

        return "Book borrowed successfully. Return within 7 days.";
    }


    public String returnBook(Long bookId) {

        // get logged in user
        String username = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // find issued record
        BorrowRecord record = borrowRecordRepository
                .findByUserAndBookIdAndStatus(user, bookId, BorrowStatus.ISSUED)
                .orElseThrow(() -> new RuntimeException("You didn't borrow this book"));

        // update record
        record.setStatus(BorrowStatus.RETURNED);
        record.setReturnDate(LocalDate.now());
        borrowRecordRepository.save(record);

        // increase available copies
        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        return "Book returned successfully";
    }
}
