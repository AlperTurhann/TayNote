package com.taynote.api.dto.task.request;

import java.util.List;
import java.util.UUID;

public class UpdateTaskRequest {

    private String title;
    private String color;
    private String description;
    private Boolean completed;
    private UUID columnId;
    private List<UUID> labelIds;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public UUID getColumnId() {
        return columnId;
    }

    public void setColumnId(UUID columnId) {
        this.columnId = columnId;
    }

    public List<UUID> getLabelIds() {
        return labelIds;
    }

    public void setLabelIds(List<UUID> labelIds) {
        this.labelIds = labelIds;
    }
}
