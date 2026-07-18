package com.taynote.api.dto.task.response;

import java.util.UUID;

public class ChangeTaskCompletedResponse {

    private UUID id;
    private boolean completed;

    public ChangeTaskCompletedResponse(UUID id, boolean completed) {
        this.id = id;
        this.completed = completed;
    }

    public UUID getId() {
        return id;
    }

    public boolean getCompleted() {
        return completed;
    }
}
