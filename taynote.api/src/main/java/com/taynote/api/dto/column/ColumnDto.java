package com.taynote.api.dto.column;

import java.util.UUID;

public class ColumnDto {

    private UUID id;
    private String name;
    private int orderNo;
    private UUID boardId;

    public ColumnDto(UUID id, String name, int orderNo, UUID boardId) {
        this.id = id;
        this.name = name;
        this.orderNo = orderNo;
        this.boardId = boardId;
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

    public UUID getBoardId() {
        return boardId;
    }
}
