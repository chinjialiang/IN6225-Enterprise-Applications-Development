package com.notificationservice.exception;

import com.notificationservice.model.ExceptionResponse;
import jakarta.validation.ConstraintViolationException;
import org.hibernate.HibernateException;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLException;
import java.util.*;

@RestControllerAdvice
public class CustomExceptionHandler {

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<List<Object>> handleValidationErrors(ConstraintViolationException ex) {
        List<Object> errorResponse = new ArrayList<>();
        ex.getConstraintViolations().forEach(i -> errorResponse.add(Map.of(i.getPropertyPath(), i.getMessage())));

        return ResponseEntity.status(422).body(errorResponse);
    }

    @ExceptionHandler(SQLException.class)
    public ResponseEntity<ExceptionResponse> handleSQLException(Exception ex) {
        return ResponseEntity.status(500).body(new ExceptionResponse(ex.getClass() + ":" + ex.getMessage()));
    }

    @ExceptionHandler(HibernateException.class)
    public ResponseEntity<ExceptionResponse> handleHibernateException(Exception ex) {
        return ResponseEntity.status(500).body(new ExceptionResponse(ex.getMessage()));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ExceptionResponse> handleResourceNotFoundException(Exception ex) {
        return ResponseEntity.status(404).body(new ExceptionResponse(ex.getMessage()));
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ExceptionResponse> handleValidationException(Exception ex) {
        return ResponseEntity.status(422).body(new ExceptionResponse(ex.getMessage()));
    }

}