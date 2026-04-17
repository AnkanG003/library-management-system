package com.library.management.dto.borrow;

import com.library.management.model.BorrowStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Data
@AllArgsConstructor
@NoArgsConstructor

public class BorrowRecordResponse {
        private Long id;
        private String username;
        private String bookTitle;
        private LocalDate issueDate;
        private LocalDate dueDate;
        private BorrowStatus status;
}
