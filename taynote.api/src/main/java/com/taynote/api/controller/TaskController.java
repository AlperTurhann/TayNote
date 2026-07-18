package com.taynote.api.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.taynote.api.dto.board.request.BoardOperationsRequest;
import com.taynote.api.dto.task.request.CreateTaskRequest;
import com.taynote.api.dto.task.request.UpdateTaskRequest;
import com.taynote.api.dto.task.request.UpdateTaskColumnRequest;
import com.taynote.api.dto.task.response.UpdateTaskColumnResponse;
import com.taynote.api.dto.task.response.CreateTaskResponse;
import com.taynote.api.dto.task.response.TaskSearchResponse;
import com.taynote.api.dto.task.response.UpdateTaskResponse;
import com.taynote.api.service.TaskService;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @PostMapping("/search")
    public TaskSearchResponse search(@RequestBody BoardOperationsRequest request) {
        return taskService.search(request);
    }

    @PostMapping
    public ResponseEntity<CreateTaskResponse> create(@RequestBody CreateTaskRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.create(request));
    }

    @PatchMapping("/{id}")
    public UpdateTaskResponse changeCompleted(@PathVariable UUID id,
            @RequestBody UpdateTaskRequest request) {
        return taskService.update(id, request);
    }

    @PatchMapping("/{id}/update-column")
    public UpdateTaskColumnResponse updateColumn(@PathVariable UUID id, @RequestBody UpdateTaskColumnRequest request) {
        return taskService.updateColumn(id, request.getColumnId());
    }

    @DeleteMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        taskService.delete(id);
    }
}
