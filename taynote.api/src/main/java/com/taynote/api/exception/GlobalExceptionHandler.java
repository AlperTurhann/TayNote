package com.taynote.api.exception;

import java.time.Instant;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.taynote.api.exception.board.BoardAlreadyExistsException;
import com.taynote.api.exception.board.BoardNotFoundException;
import com.taynote.api.exception.column.ColumnNotEmptyException;
import com.taynote.api.exception.column.ColumnNotFoundException;
import com.taynote.api.exception.task.TaskNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    private static final String STATUS = "status";
    private static final String MESSAGE = "message";
    private static final String TIMESTAMP = "timestamp";

    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleTaskNotFound(TaskNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                STATUS, HttpStatus.NOT_FOUND.value(),
                MESSAGE, ex.getMessage(),
                TIMESTAMP, Instant.now().toString()));
    }

    @ExceptionHandler(ColumnNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleColumnNotFound(ColumnNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                STATUS, HttpStatus.NOT_FOUND.value(),
                MESSAGE, ex.getMessage(),
                TIMESTAMP, Instant.now().toString()));
    }

    @ExceptionHandler(ColumnNotEmptyException.class)
    public ResponseEntity<Map<String, Object>> handleColumnNotEmpty(ColumnNotEmptyException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                STATUS, HttpStatus.CONFLICT.value(),
                MESSAGE, ex.getMessage(),
                TIMESTAMP, Instant.now().toString()));
    }

    @ExceptionHandler(BoardNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleBoardNotFound(BoardNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                STATUS, HttpStatus.NOT_FOUND.value(),
                MESSAGE, ex.getMessage(),
                TIMESTAMP, Instant.now().toString()));
    }

    @ExceptionHandler(BoardAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleBoardAlreadyExists(BoardAlreadyExistsException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                STATUS, HttpStatus.CONFLICT.value(),
                MESSAGE, ex.getMessage(),
                TIMESTAMP, Instant.now().toString()));
    }
}
