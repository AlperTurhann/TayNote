package com.taynote.api.dto.task.response;

import java.util.UUID;

public class UpdateTaskColumnResponse {

    private UUID id;
    private UUID columnId;

    public UpdateTaskColumnResponse(UUID id, UUID columnId) {
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
