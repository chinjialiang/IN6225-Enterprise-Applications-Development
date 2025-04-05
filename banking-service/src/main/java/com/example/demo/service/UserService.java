package com.example.demo.service;

import com.example.demo.exception.ValidationException;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;


@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User userRegistration) {
        String userId = userRegistration.getUserId();
        String pin = userRegistration.getPin();
        String name = userRegistration.getName();
        String accountNumber = String.valueOf(Instant.now().toEpochMilli());
        double accountBalance = userRegistration.getAccountBalance();
        Instant createdAt = Instant.now();

        System.out.println("accountBalance " + accountBalance);

        User originalEntity = userRepository.findByUserId(userId);

        if (originalEntity != null) {
            throw new ValidationException("User already exists");
        }

        User user = new User(userId, pin, name, accountNumber, accountBalance, createdAt, null);

        return userRepository.save(user);
    }
}
