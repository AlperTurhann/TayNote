package com.taynote.api.dto;

import java.util.UUID;

public class ChangeTaskColumnResponse {

    private UUID id;
    private UUID columnId;

    public ChangeTaskColumnResponse(UUID id, UUID columnId) {
        this.id = id;
        this.columnId = columnId;
    }

    public UUID getId() {
        return id;
    }

    public UUID getColumnId() {
        return columnId;
    }
}
