package com.taynote.api.dto.task.request;

import java.util.UUID;

public class UpdateTaskColumnRequest {

    private UUID columnId;
    private int targetIndex;

    public UUID getColumnId() {
        return columnId;
    }

    public void setColumnId(UUID columnId) {
        this.columnId = columnId;
    }

    public int getTargetIndex() {
        return targetIndex;
    }

    public void setTargetIndex(int targetIndex) {
        this.targetIndex = targetIndex;
    }
}
