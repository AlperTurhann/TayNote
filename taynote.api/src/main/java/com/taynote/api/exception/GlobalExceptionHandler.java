package com.taynote.api.exception;

import java.time.Instant;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleTaskNotFound(TaskNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "status", HttpStatus.NOT_FOUND.value(),
                "message", ex.getMessage(),
                "timestamp", Instant.now().toString()));
    }

    @ExceptionHandler(ColumnNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleColumnNotFound(ColumnNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                "status", HttpStatus.NOT_FOUND.value(),
                "message", ex.getMessage(),
                "timestamp", Instant.now().toString()));
    }

    @ExceptionHandler(ColumnNotEmptyException.class)
    public ResponseEntity<Map<String, Object>> handleColumnNotEmpty(ColumnNotEmptyException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                "status", HttpStatus.CONFLICT.value(),
                "message", ex.getMessage(),
                "timestamp", Instant.now().toString()));
    }
}
