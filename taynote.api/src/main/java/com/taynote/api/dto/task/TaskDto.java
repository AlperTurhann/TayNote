package com.taynote.api.dto.task;

import java.util.UUID;

public class TaskDto {

    private UUID id;
    private String title;
    private String color;
    private String description;
    private boolean completed;
    private UUID columnId;

    public TaskDto(UUID id, String title, String color, String description, boolean completed, UUID columnId) {
        this.id = id;
        this.title = title;
        this.color = color;
        this.description = description;
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

    public String getDescription() {
        return description;
    }

    public boolean getCompleted() {
        return completed;
    }

    public UUID getColumnId() {
        return columnId;
    }
}
