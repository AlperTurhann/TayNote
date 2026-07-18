package com.taynote.api.dto.board.response;

import java.util.UUID;

public class CreateBoardResponse {

    private UUID id;
    private String name;

    public CreateBoardResponse(UUID id, String name) {
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
