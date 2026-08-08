package com.taynote.api.dto.label.request;

import java.util.UUID;

public class CreateLabelRequest {

    private String name;
    private String color;
    // null means this label should be created as a global label.
    private UUID boardId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public UUID getBoardId() {
        return boardId;
    }

    public void setBoardId(UUID boardId) {
        this.boardId = boardId;
    }
}
