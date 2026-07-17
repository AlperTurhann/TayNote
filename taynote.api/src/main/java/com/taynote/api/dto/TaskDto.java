package com.taynote.api.dto;

import java.util.UUID;

public class TaskDto {

    private UUID id;
    private String title;
    private String color;
    private UUID columnId;

    public TaskDto(UUID id, String title, String color, UUID columnId) {
        this.id = id;
        this.title = title;
        this.color = color;
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

    public UUID getColumnId() {
        return columnId;
    }
}
