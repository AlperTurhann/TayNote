package com.taynote.api.exception.board;

public class BoardAlreadyExistsException extends RuntimeException {

    public BoardAlreadyExistsException(String name) {
        super("Board already exists: " + name);
    }
}
