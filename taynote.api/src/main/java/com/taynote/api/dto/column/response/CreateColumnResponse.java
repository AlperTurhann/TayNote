package com.taynote.api.dto.column.response;

import java.util.UUID;

public class CreateColumnResponse {

    private UUID id;
    private String name;
    private Integer orderNo;
    private UUID boardId;

    public CreateColumnResponse(UUID id, String name, Integer orderNo, UUID boardId) {
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

    public Integer getOrderNo() {
        return orderNo;
    }

    public UUID getBoardId() {
        return boardId;
    }
}
