package com.taynote.api.dto;

import java.util.UUID;

import com.taynote.api.entity.Status;

public class TaskDto {

    private UUID id;
    private String title;
    private String color;
    private Status status;

    public TaskDto(UUID id, String title, String color, Status status) {
        this.id = id;
        this.title = title;
        this.color = color;
        this.status = status;
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

    public Status getStatus() {
        return status;
    }
}
