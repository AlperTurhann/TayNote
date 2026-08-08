package com.taynote.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.taynote.api.dto.board.request.BoardOperationsRequest;
import com.taynote.api.dto.task.TaskDto;
import com.taynote.api.dto.task.request.CreateTaskRequest;
import com.taynote.api.dto.task.request.UpdateTaskRequest;
import com.taynote.api.dto.task.response.UpdateTaskColumnResponse;
import com.taynote.api.dto.task.response.CreateTaskResponse;
import com.taynote.api.dto.task.response.TaskSearchResponse;
import com.taynote.api.dto.task.response.UpdateTaskResponse;
import com.taynote.api.entity.BoardColumn;
import com.taynote.api.entity.Task;
import com.taynote.api.exception.column.ColumnNotFoundException;
import com.taynote.api.exception.task.TaskNotFoundException;
import com.taynote.api.mapper.TaskMapper;
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

    public TaskSearchResponse search(BoardOperationsRequest request) {
        Sort sort = switch (request.getSorting()) {
            case "ascending" -> Sort.by(new Sort.Order(Sort.Direction.ASC, "title").ignoreCase());
            case "descending" -> Sort.by(new Sort.Order(Sort.Direction.DESC, "title").ignoreCase());
            default -> Sort.by(Sort.Direction.ASC, "orderNo").and(Sort.by(Sort.Direction.DESC, "createdAt"));
        };
        int pageIndex = Math.max(request.getPageIndex() - 1, 0);
        Pageable pageable = PageRequest.of(pageIndex, request.getPageSize(), sort);
        String query = request.getQuery() == null ? "" : request.getQuery();
        Page<Task> page;

        if (request.getColumnId() != null) {
            page = taskRepository.findByColumn_IdAndTitleContainingIgnoreCase(
                    request.getColumnId(), query, pageable);
        } else {
            page = taskRepository.findByTitleContainingIgnoreCase(query, pageable);
        }

        List<TaskDto> items = page.getContent().stream().map(TaskMapper::toDto).toList();

        return TaskMapper.toSearchResponse(items, page.hasNext());
    }

    public CreateTaskResponse create(CreateTaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setColor(request.getColor());
        task.setDescription(request.getDescription());
        task.setColumn(findColumn(request.getColumnId()));
        return TaskMapper.toCreateResponse(taskRepository.save(task));
    }

    public UpdateTaskResponse update(UUID id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        if (request.getTitle() != null) {
            task.setTitle(request.getTitle());
        }
        if (request.getColor() != null) {
            task.setColor(request.getColor());
        }
        if (request.getDescription() != null) {
            task.setDescription(request.getDescription());
        }
        if (request.getCompleted() != null) {
            task.setCompleted(request.getCompleted());
        }
        return TaskMapper.toUpdateResponse(taskRepository.save(task));
    }

    public UpdateTaskColumnResponse move(UUID id, UUID columnId, int targetIndex) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new TaskNotFoundException(id));
        BoardColumn destColumn = findColumn(columnId);

        List<Task> destTasks = taskRepository.findByColumn_IdOrderByOrderNoAscCreatedAtDesc(columnId);
        destTasks.removeIf(t -> t.getId().equals(id));

        int index = Math.max(0, Math.min(targetIndex, destTasks.size()));
        destTasks.add(index, task);
        task.setColumn(destColumn);

        for (int i = 0; i < destTasks.size(); i++) {
            destTasks.get(i).setOrderNo(i);
        }
        taskRepository.saveAll(destTasks);

        return TaskMapper.toUpdateColumnResponse(task);
    }

    private BoardColumn findColumn(UUID columnId) {
        return columnRepository.findById(columnId).orElseThrow(() -> new ColumnNotFoundException(columnId));
    }

    public void delete(UUID id) {
        if (!taskRepository.existsById(id)) {
            throw new TaskNotFoundException(id);
        }

        taskRepository.deleteById(id);
    }
}
