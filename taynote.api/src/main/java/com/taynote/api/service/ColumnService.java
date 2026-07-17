package com.taynote.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.taynote.api.dto.CreateColumnRequest;
import com.taynote.api.dto.UpdateColumnRequest;
import com.taynote.api.entity.BoardColumn;
import com.taynote.api.exception.ColumnNotEmptyException;
import com.taynote.api.exception.ColumnNotFoundException;
import com.taynote.api.repository.ColumnRepository;
import com.taynote.api.repository.TaskRepository;

@Service
public class ColumnService {

    private final ColumnRepository columnRepository;
    private final TaskRepository taskRepository;

    public ColumnService(ColumnRepository columnRepository, TaskRepository taskRepository) {
        this.columnRepository = columnRepository;
        this.taskRepository = taskRepository;
    }

    public List<BoardColumn> findAll() {
        return columnRepository.findAllByOrderByOrderNoAsc();
    }

    public BoardColumn create(CreateColumnRequest request) {
        BoardColumn column = new BoardColumn();
        column.setName(request.getName());
        column.setOrderNo(request.getOrderNo() != null ? request.getOrderNo() : nextOrderNo());
        return columnRepository.save(column);
    }

    public BoardColumn update(UUID id, UpdateColumnRequest request) {
        BoardColumn column = columnRepository.findById(id).orElseThrow(() -> new ColumnNotFoundException(id));
        if (request.getName() != null) {
            column.setName(request.getName());
        }
        if (request.getOrderNo() != null) {
            column.setOrderNo(request.getOrderNo());
        }
        return columnRepository.save(column);
    }

    public void delete(UUID id) {
        BoardColumn column = columnRepository.findById(id).orElseThrow(() -> new ColumnNotFoundException(id));
        if (taskRepository.existsByColumn_Id(id)) {
            throw new ColumnNotEmptyException(id);
        }
        columnRepository.delete(column);
    }

    private int nextOrderNo() {
        return columnRepository.findAllByOrderByOrderNoAsc().stream()
                .mapToInt(BoardColumn::getOrderNo)
                .max()
                .orElse(-1) + 1;
    }
}
