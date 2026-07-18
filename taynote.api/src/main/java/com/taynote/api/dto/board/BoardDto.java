package com.taynote.api.dto.board;

import java.util.UUID;

public class BoardDto {

    private UUID id;
    private String name;

    public BoardDto(UUID id, String name) {
        this.id = id;
        this.name = name;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }
}
