package com.taynote.api.dto.board.response;

import java.util.UUID;

public class UpdateBoardResponse {

    private UUID id;
    private String name;

    public UpdateBoardResponse(UUID id, String name) {
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
