package com.taynote.api.dto.task.request;

public class ChangeTaskCompletedRequest {

    private boolean completed;

    public boolean getCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}
