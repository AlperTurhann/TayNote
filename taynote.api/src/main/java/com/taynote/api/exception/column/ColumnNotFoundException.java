package com.taynote.api.exception.column;

import java.util.UUID;

public class ColumnNotFoundException extends RuntimeException {

    public ColumnNotFoundException(UUID id) {
        super("Column not found: " + id);
    }
}
