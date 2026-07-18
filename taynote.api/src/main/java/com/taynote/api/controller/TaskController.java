package com.taynote.api.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taynote.api.dto.ChangeTaskColumnResponse;
import com.taynote.api.dto.ChangeTaskCompletedResponse;
import com.taynote.api.dto.CreateTaskRequest;
import com.taynote.api.dto.TableOperationsRequest;
import com.taynote.api.dto.TaskDto;
import com.taynote.api.dto.TaskSearchResponse;
import com.taynote.api.dto.UpdateTaskColumnRequest;
import com.taynote.api.dto.UpdateTaskCompletedRequest;
import com.taynote.api.entity.Task;
import com.taynote.api.mapper.TaskMapper;
import com.taynote.api.service.TaskService;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/search")
    public TaskSearchResponse search(@RequestBody TableOperationsRequest request) {
        Page<Task> page = taskService.search(request);
        List<TaskDto> items = page.getContent().stream().map(TaskMapper::toDto).toList();
        return new TaskSearchResponse(items, page.hasNext());
    }

    @PostMapping
    public ResponseEntity<TaskDto> create(@RequestBody CreateTaskRequest request) {
        Task task = taskService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(TaskMapper.toDto(task));
    }

    @PatchMapping("/{id}")
    public ChangeTaskColumnResponse changeColumn(@PathVariable UUID id, @RequestBody UpdateTaskColumnRequest request) {
        Task task = taskService.changeColumn(id, request.getColumnId());
        return new ChangeTaskColumnResponse(task.getId(), task.getColumn().getId());
    }

    @PatchMapping("/{id}/change-complete")
    public ChangeTaskCompletedResponse changeCompleted(@PathVariable UUID id,
            @RequestBody UpdateTaskCompletedRequest request) {
        Task task = taskService.changeCompleted(id, request.getCompleted());
        return new ChangeTaskCompletedResponse(task.getId(), task.getCompleted());
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public UUID delete(@PathVariable UUID id) {
        taskService.delete(id);
        return id;
    }
}
