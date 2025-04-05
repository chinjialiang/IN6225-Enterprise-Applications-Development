package com.example.demo.controller;

import com.example.demo.exception.ValidationException;
import com.example.demo.model.User;
import com.example.demo.model.UserLogin;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
public class UserController {

    UserService userService;
    UserRepository userRepository;

    @Autowired
    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User userRegistration) {
        System.out.println("Executing registerUser");

        System.out.println("userRegistration" + userRegistration.getAccountBalance());

        User user = userService.createUser(userRegistration);

        return ResponseEntity.status(201).body(user);
    }

    @PostMapping("/login")
    public ResponseEntity<User> userLogin(@RequestBody UserLogin userLogin) {
        System.out.println("Executing userLogin");

        String userId = userLogin.getUserId();
        String pin = userLogin.getPin();

        User originalEntity = userRepository.findByUserId(userId);

        if (originalEntity == null) {
            throw new ValidationException("Incorrect User ID");
        } else if (!originalEntity.getPin().equals(pin) ) {
            throw new ValidationException("Incorrect PIN");
        }

        originalEntity.setLastLogin(Instant.now());
        userRepository.save(originalEntity);

        return ResponseEntity.ok(originalEntity);
    }
}
