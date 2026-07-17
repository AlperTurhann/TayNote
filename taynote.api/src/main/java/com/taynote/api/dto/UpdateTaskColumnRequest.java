package com.taynote.api.dto;

import java.util.UUID;

public class UpdateTaskColumnRequest {

    private UUID columnId;

    public UUID getColumnId() {
        return columnId;
    }

    public void setColumnId(UUID columnId) {
        this.columnId = columnId;
    }
}
