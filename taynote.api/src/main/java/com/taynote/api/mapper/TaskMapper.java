package com.taynote.api.mapper;

import com.taynote.api.dto.TaskDto;
import com.taynote.api.entity.Task;

public final class TaskMapper {

    private TaskMapper() {
    }

    public static TaskDto toDto(Task task) {
        return new TaskDto(task.getId(), task.getTitle(), task.getColor(), task.getColumn().getId());
    }
}
