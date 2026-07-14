package com.taynote.api.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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

import com.taynote.api.dto.ChangeTaskStatusResponse;
import com.taynote.api.dto.CreateTaskRequest;
import com.taynote.api.dto.TableOperationsRequest;
import com.taynote.api.dto.TaskDto;
import com.taynote.api.dto.UpdateStatusRequest;
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
    public List<TaskDto> search(@RequestBody TableOperationsRequest request) {
        return taskService.search(request).stream().map(TaskMapper::toDto).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<TaskDto> create(@RequestBody CreateTaskRequest request) {
        Task task = taskService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(TaskMapper.toDto(task));
    }

    @PatchMapping("/{id}")
    public ChangeTaskStatusResponse changeStatus(@PathVariable UUID id, @RequestBody UpdateStatusRequest request) {
        Task task = taskService.changeStatus(id, request.getStatus());
        return new ChangeTaskStatusResponse(task.getId(), task.getStatus());
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public UUID delete(@PathVariable UUID id) {
        taskService.delete(id);
        return id;
    }
}
