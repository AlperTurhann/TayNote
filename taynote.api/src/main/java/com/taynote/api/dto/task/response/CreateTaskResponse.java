package com.taynote.api.dto.task.response;

import java.util.List;
import java.util.UUID;

import com.taynote.api.dto.label.LabelDto;

public class CreateTaskResponse {

    private UUID id;
    private String title;
    private String color;
    private String description;
    private boolean completed;
    private UUID columnId;
    private List<LabelDto> labels;

    public CreateTaskResponse(UUID id, String title, String color, String description, boolean completed,
            UUID columnId, List<LabelDto> labels) {
        this.id = id;
        this.title = title;
        this.color = color;
        this.description = description;
        this.completed = completed;
        this.columnId = columnId;
        this.labels = labels;
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

    public List<LabelDto> getLabels() {
        return labels;
    }
}
