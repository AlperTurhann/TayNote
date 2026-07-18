package com.taynote.api.dto.task.response;

import java.util.UUID;

public class CreateTaskResponse {

    private UUID id;
    private String title;
    private String color;
    private boolean completed;
    private UUID columnId;

    public CreateTaskResponse(UUID id, String title, String color, boolean completed, UUID columnId) {
        this.id = id;
        this.title = title;
        this.color = color;
        this.completed = completed;
        this.columnId = columnId;
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getColor() {
        return color;
    }

    public boolean getCompleted() {
        return completed;
    }

    public UUID getColumnId() {
        return columnId;
    }
}
