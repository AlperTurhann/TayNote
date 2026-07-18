package com.taynote.api.dto;

public class UpdateTaskCompletedRequest {

    private boolean completed;

    public boolean getCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
