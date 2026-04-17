package com.library.management.repository;

import com.library.management.model.BorrowRecord;
import com.library.management.model.BorrowStatus;
import com.library.management.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Long> {
    //All borrow records
    List<BorrowRecord> findByUser(User user);

    //Currently issued Books
    List<BorrowRecord> findByUserAndStatus(User user, BorrowStatus status);

    //Active Borrow Records
    Optional<BorrowRecord> findByUserAndBookIdAndStatus(
      User user,
      Long bookId,
      BorrowStatus status
    );
    // Check if a book is already issued to the user
    boolean existsByUserAndBookIdAndStatus(
            User user,
            Long bookId,
            BorrowStatus status
    );

    boolean existsByBookIdAndStatus(Long bookId, BorrowStatus status);

}

