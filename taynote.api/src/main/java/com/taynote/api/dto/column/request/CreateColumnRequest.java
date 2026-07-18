package com.taynote.api.dto.column.request;

import java.util.UUID;

public class CreateColumnRequest {

    private String name;
    private UUID boardId;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UUID getBoardId() {
        return boardId;
    }

    public void setBoardId(UUID boardId) {
        this.boardId = boardId;
    }
}
