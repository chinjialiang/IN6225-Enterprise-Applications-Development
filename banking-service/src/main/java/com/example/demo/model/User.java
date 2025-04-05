package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;

import java.time.Instant;

@Entity
@Table(name = "user")
public class User {

    @Id
    String userId;
    String pin;
    String name;
    String accountNumber;
    double accountBalance;
    Instant createdAt;
    Instant lastLogin;

    public User() {}

    public User(String userId, String pin, String name, String accountNumber, double accountBalance, Instant createdAt, Instant lastLogin) {
        this.userId = userId;
        this.pin = pin;
        this.name = name;
        this.accountNumber = accountNumber;
        this.accountBalance = accountBalance;
        this.createdAt= createdAt;
        this.lastLogin = lastLogin;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public double getAccountBalance() {
        return accountBalance;
    }

    public void setAccountBalance(double accountBalance) {
        this.accountBalance = accountBalance;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getLastLogin() {
        return lastLogin;
    }

    public void setLastLogin(Instant lastLogin) {
        this.lastLogin = lastLogin;
    }
}

