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
import com.taynote.api.dto.task.request.ChangeTaskColumnRequest;
import com.taynote.api.dto.task.request.ChangeTaskCompletedRequest;
import com.taynote.api.dto.task.response.ChangeTaskColumnResponse;
import com.taynote.api.dto.task.response.ChangeTaskCompletedResponse;
import com.taynote.api.dto.task.response.CreateTaskResponse;
import com.taynote.api.dto.task.response.TaskSearchResponse;
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
    public ChangeTaskColumnResponse changeColumn(@PathVariable UUID id, @RequestBody ChangeTaskColumnRequest request) {
        return taskService.changeColumn(id, request.getColumnId());
    }

    @PatchMapping("/{id}/change-complete")
    public ChangeTaskCompletedResponse changeCompleted(@PathVariable UUID id,
            @RequestBody ChangeTaskCompletedRequest request) {
        return taskService.changeCompleted(id, request.getCompleted());
    }

    @DeleteMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        taskService.delete(id);
    }
}
