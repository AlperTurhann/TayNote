package com.taynote.api.dto.savedcolor;

import java.util.UUID;

public class SavedColorDto {

    private UUID id;
    private String name;
    private String hex;

    public SavedColorDto(UUID id, String name, String hex) {
        this.id = id;
        this.name = name;
        this.hex = hex;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getHex() {
        return hex;
    }
}
