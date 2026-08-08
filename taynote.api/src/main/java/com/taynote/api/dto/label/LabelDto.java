package com.taynote.api.dto.label;

import java.util.UUID;

public class LabelDto {

    private UUID id;
    private String name;
    private String color;
    private UUID boardId;

    public LabelDto(UUID id, String name, String color, UUID boardId) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.boardId = boardId;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getColor() {
        return color;
    }

    public UUID getBoardId() {
        return boardId;
    }
}
