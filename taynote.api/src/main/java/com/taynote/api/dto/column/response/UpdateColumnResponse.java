package com.taynote.api.dto.column.response;

import java.util.UUID;

public class UpdateColumnResponse {

    private UUID id;
    private String name;
    private Integer orderNo;

    public UpdateColumnResponse(UUID id, String name, Integer orderNo) {
        this.id = id;
        this.name = name;
        this.orderNo = orderNo;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Integer getOrderNo() {
        return orderNo;
    }
}
