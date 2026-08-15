package com.taynote.api.exception.savedcolor;

import java.util.UUID;

public class SavedColorNotFoundException extends RuntimeException {

    public SavedColorNotFoundException(UUID id) {
        super("Saved color not found: " + id);
    }
}
