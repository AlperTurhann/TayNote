package com.taynote.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.taynote.api.dto.CreateTaskRequest;
import com.taynote.api.dto.TableOperationsRequest;
import com.taynote.api.entity.Status;
import com.taynote.api.entity.Task;
import com.taynote.api.exception.TaskNotFoundException;
import com.taynote.api.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> search(TableOperationsRequest request) {
        Sort sort = switch (request.getSorting()) {
            case "ascending" -> Sort.by(Sort.Direction.ASC, "title");
            case "descending" -> Sort.by(Sort.Direction.DESC, "title");
            default -> Sort.by(Sort.Direction.ASC, "createdAt");
        };
        int pageIndex = Math.max(request.getPageIndex() - 1, 0);
        Pageable pageable = PageRequest.of(pageIndex, request.getPageSize(), sort);
        String query = request.getQuery() == null ? "" : request.getQuery();
        return taskRepository.findByTitleContainingIgnoreCase(query, pageable).getContent();
    }

    public Task create(CreateTaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setColor(request.getColor());
        task.setStatus(request.getStatus() != null ? request.getStatus() : Status.PRODUCT_BACKLOG);
        return taskRepository.save(task);
    }

    public Task changeStatus(UUID id, Status status) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        task.setStatus(status);
        return taskRepository.save(task);
    }

    public void delete(UUID id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        taskRepository.delete(task);
    }
}
