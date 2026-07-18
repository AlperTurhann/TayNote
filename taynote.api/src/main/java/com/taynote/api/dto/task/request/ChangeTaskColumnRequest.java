package com.taynote.api.dto.task.request;

import java.util.UUID;

public class ChangeTaskColumnRequest {

    private UUID columnId;

    public UUID getColumnId() {
        return columnId;
    }

    public void setColumnId(UUID columnId) {
        this.columnId = columnId;
    }
}
