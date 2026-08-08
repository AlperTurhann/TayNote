package com.taynote.api.dto.board.request;

import java.util.List;
import java.util.UUID;

public class BoardOperationsRequest {

    private String sorting;
    private int pageIndex;
    private int pageSize;
    private String query;
    private UUID columnId;
    private List<UUID> labelIds;

    public UUID getColumnId() {
        return columnId;
    }

    public void setColumnId(UUID columnId) {
        this.columnId = columnId;
    }

    public List<UUID> getLabelIds() {
        return labelIds;
    }

    public void setLabelIds(List<UUID> labelIds) {
        this.labelIds = labelIds;
    }

    public String getSorting() {
        return sorting;
    }

    public void setSorting(String sorting) {
        this.sorting = sorting;
    }

    public int getPageIndex() {
        return pageIndex;
    }

    public void setPageIndex(int pageIndex) {
        this.pageIndex = pageIndex;
    }

    public int getPageSize() {
        return pageSize;
    }

    public void setPageSize(int pageSize) {
        this.pageSize = pageSize;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }
}
