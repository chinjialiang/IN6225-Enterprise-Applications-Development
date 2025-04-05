package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<User, String>, PagingAndSortingRepository<User, String> {

    User findByUserId(String userId);
    User findByAccountNumber(String accountNumber);
}
