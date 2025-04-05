package com.example.demo.repository;

import com.example.demo.model.Transaction;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends CrudRepository<Transaction, String>, PagingAndSortingRepository<Transaction, String> {

    List<Transaction> findAllByFromAccount(String accountNumber);
    List<Transaction> findAllByToAccount(String accountNumber);
}
