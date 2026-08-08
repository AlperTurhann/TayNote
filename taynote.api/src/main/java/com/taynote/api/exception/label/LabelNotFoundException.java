package com.taynote.api.exception.label;

import java.util.UUID;

public class LabelNotFoundException extends RuntimeException {

    public LabelNotFoundException(UUID id) {
        super("Label not found: " + id);
    }
}
