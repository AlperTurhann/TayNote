package com.taynote.api.exception.savedcolor;

public class SavedColorAlreadyExistsException extends RuntimeException {

    public SavedColorAlreadyExistsException(String name) {
        super("Saved color already exists: " + name);
    }
}
