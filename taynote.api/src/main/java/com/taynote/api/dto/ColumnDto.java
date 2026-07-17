package com.taynote.api.dto;

import java.util.UUID;

public class ColumnDto {

    private UUID id;
    private String name;
    private int orderNo;

    public ColumnDto(UUID id, String name, int orderNo) {
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

    public int getOrderNo() {
        return orderNo;
    }
}
