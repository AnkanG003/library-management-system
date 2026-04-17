
package com.library.management.repository;

import com.library.management.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<Book> findByIsbn(String isbn);


    @Query("SELECT b FROM Book b WHERE b.active = true")
    List<Book> findAllActive();

    long countByActiveTrue();

    Optional<Book> findByIdAndActiveTrue(Long id);

}
