package com.library.management.service;

import com.library.management.model.Book;
import com.library.management.model.BorrowStatus;
import com.library.management.model.User;
import com.library.management.repository.BookRepository;
import com.library.management.repository.BorrowRecordRepository;
import com.library.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final BorrowRecordRepository borrowRecordRepository;

    public Book addBook(Book book) {
        book.setAvailableCopies(book.getTotalCopies());
        return bookRepository.save(book);
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAllActive();
    }


    public Book getBookById(Long id){

        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id ));
    }

    // Change from (Long id) to (Long id, String adminPassword)
    @Transactional
    public void deleteBook(Long id, String adminPassword) {

        // 1. Identity Check: Get the Admin from the JWT token
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        User admin = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Current Admin not found"));

        // 2. Security Check: Verify the password
        if (!passwordEncoder.matches(adminPassword, admin.getPassword())) {
            throw new RuntimeException("Security violation: Incorrect Admin password!");
        }

        // 3. Find the Book
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        // 4. Logic Check: Don't deactivate if someone is currently holding it
        boolean isBorrowed = borrowRecordRepository.existsByBookIdAndStatus(id, BorrowStatus.ISSUED);
        if (isBorrowed) {
            throw new RuntimeException("Cannot deactivate: A user is currently holding this book.");
        }

        // 5. THE CHANGE: Instead of bookRepository.delete(book), we do:
        book.setActive(false);
        bookRepository.save(book);
    }

    public Book updateBook(Long id, Book updatedBook) {
        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));


        int difference = updatedBook.getTotalCopies() - existingBook.getTotalCopies();

        existingBook.setTitle(updatedBook.getTitle());
        existingBook.setAuthor(updatedBook.getAuthor());
        existingBook.setIsbn(updatedBook.getIsbn());
        existingBook.setCategory(updatedBook.getCategory());
        existingBook.setTotalCopies(updatedBook.getTotalCopies());

        int newAvailable = existingBook.getAvailableCopies() + difference;

        existingBook.setAvailableCopies(Math.max(0, newAvailable));

        return bookRepository.save(existingBook);
    }
}
