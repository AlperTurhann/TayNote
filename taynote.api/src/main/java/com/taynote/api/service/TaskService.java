package com.taynote.api.service;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.taynote.api.dto.CreateTaskRequest;
import com.taynote.api.dto.TableOperationsRequest;
import com.taynote.api.entity.BoardColumn;
import com.taynote.api.entity.Task;
import com.taynote.api.exception.ColumnNotFoundException;
import com.taynote.api.exception.TaskNotFoundException;
import com.taynote.api.repository.ColumnRepository;
import com.taynote.api.repository.TaskRepository;

@Service
public class TaskService {

    private final TaskRepository taskRepository;
    private final ColumnRepository columnRepository;

    public TaskService(TaskRepository taskRepository, ColumnRepository columnRepository) {
        this.taskRepository = taskRepository;
        this.columnRepository = columnRepository;
    }

    public Page<Task> search(TableOperationsRequest request) {
        Sort sort = switch (request.getSorting()) {
            case "ascending" -> Sort.by(Sort.Direction.ASC, "title");
            case "descending" -> Sort.by(Sort.Direction.DESC, "title");
            default -> Sort.by(Sort.Direction.ASC, "createdAt");
        };
        int pageIndex = Math.max(request.getPageIndex() - 1, 0);
        Pageable pageable = PageRequest.of(pageIndex, request.getPageSize(), sort);
        String query = request.getQuery() == null ? "" : request.getQuery();

        if (request.getColumnId() != null) {
            return taskRepository.findByColumn_IdAndTitleContainingIgnoreCase(
                    request.getColumnId(), query, pageable);
        }
        return taskRepository.findByTitleContainingIgnoreCase(query, pageable);
    }

    public Task create(CreateTaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setColor(request.getColor());
        task.setColumn(findColumn(request.getColumnId()));
        return taskRepository.save(task);
    }

    public Task changeColumn(UUID id, UUID columnId) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        task.setColumn(findColumn(columnId));
        return taskRepository.save(task);
    }

    private BoardColumn findColumn(UUID columnId) {
        return columnRepository.findById(columnId).orElseThrow(() -> new ColumnNotFoundException(columnId));
    }

    public void delete(UUID id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        taskRepository.delete(task);
    }
}
