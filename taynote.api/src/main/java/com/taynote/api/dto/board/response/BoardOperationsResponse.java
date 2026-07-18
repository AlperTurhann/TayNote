package com.taynote.api.dto.board.response;

import java.util.UUID;

public class BoardOperationsResponse {

    private String sorting;
    private int pageIndex;
    private int pageSize;
    private String query;
    private UUID columnId;

    public BoardOperationsResponse(String sorting, int pageIndex, int pageSize, String query, UUID columnId) {
        this.sorting = sorting;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.query = query;
        this.columnId = columnId;
    }

    public String getSorting() {
        return sorting;
    }

    public int getPageIndex() {
        return pageIndex;
    }

    public int getPageSize() {
        return pageSize;
    }

    public String getQuery() {
        return query;
    }

    public UUID getColumnId() {
        return columnId;
    }
}
