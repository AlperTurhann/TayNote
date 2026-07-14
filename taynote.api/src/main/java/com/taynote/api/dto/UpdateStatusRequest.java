package com.taynote.api.dto;

import com.taynote.api.entity.Status;

public class UpdateStatusRequest {

    private Status status;

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
