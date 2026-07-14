package com.taynote.api.dto;

import java.util.UUID;

import com.taynote.api.entity.Status;

public class ChangeTaskStatusResponse {

    private UUID id;
    private Status status;

    public ChangeTaskStatusResponse(UUID id, Status status) {
        this.id = id;
        this.status = status;
    }

    public UUID getId() {
        return id;
    }

    public Status getStatus() {
        return status;
    }
}
