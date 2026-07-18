package com.taynote.api.mapper;

import java.util.List;

import com.taynote.api.dto.task.TaskDto;
import com.taynote.api.dto.task.response.ChangeTaskColumnResponse;
import com.taynote.api.dto.task.response.ChangeTaskCompletedResponse;
import com.taynote.api.dto.task.response.CreateTaskResponse;
import com.taynote.api.dto.task.response.TaskSearchResponse;
import com.taynote.api.entity.Task;

public final class TaskMapper {

    private TaskMapper() {
    }

    public static TaskDto toDto(Task task) {
        return new TaskDto(task.getId(), task.getTitle(), task.getColor(), task.getCompleted(),
                task.getColumn().getId());
    }

    public static TaskSearchResponse toSearchResponse(List<TaskDto> items, boolean hasMore) {
        return new TaskSearchResponse(items, hasMore);
    }

    public static CreateTaskResponse toCreateResponse(Task task) {
        return new CreateTaskResponse(task.getId(), task.getTitle(), task.getColor(), task.getCompleted(),
                task.getColumn().getId());
    }

    public static ChangeTaskColumnResponse toChangeColumnResponse(Task task) {
        return new ChangeTaskColumnResponse(task.getId(), task.getColumn().getId());
    }

    public static ChangeTaskCompletedResponse toChangeCompletedResponse(Task task) {
        return new ChangeTaskCompletedResponse(task.getId(), task.getCompleted());
    }
}
