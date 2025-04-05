package com.example.demo.exception;

public class ValidationException extends RuntimeException{

    public ValidationException() {}

    public ValidationException(String message) {
        super(message);
    }
}
