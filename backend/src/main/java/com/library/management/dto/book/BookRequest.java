package com.library.management.dto.book;

import lombok.Data;

@Data
public class BookRequest {
    private String title;
    private String author;
    private String isbn;
    private String category;
    private int totalCopies;
}
