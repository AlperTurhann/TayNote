package com.taynote.api.exception;

import java.util.UUID;

public class ColumnNotEmptyException extends RuntimeException {

    public ColumnNotEmptyException(UUID id) {
        super("Column has tasks and cannot be deleted: " + id);
    }
}
