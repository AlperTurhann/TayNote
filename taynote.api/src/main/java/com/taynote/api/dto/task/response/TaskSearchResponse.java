package com.taynote.api.dto.task.response;

import java.util.List;

import com.taynote.api.dto.task.TaskDto;

public class TaskSearchResponse {

    private List<TaskDto> items;
    private boolean hasMore;

    public TaskSearchResponse(List<TaskDto> items, boolean hasMore) {
        this.items = items;
        this.hasMore = hasMore;
    }

    public List<TaskDto> getItems() {
        return items;
    }

    public boolean isHasMore() {
        return hasMore;
    }
}
