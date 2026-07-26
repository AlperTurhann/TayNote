package com.taynote.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.taynote.api.dto.column.request.CreateColumnRequest;
import com.taynote.api.dto.column.request.UpdateColumnRequest;
import com.taynote.api.dto.column.response.CreateColumnResponse;
import com.taynote.api.dto.column.response.UpdateColumnResponse;
import com.taynote.api.entity.Board;
import com.taynote.api.entity.BoardColumn;
import com.taynote.api.exception.board.BoardNotFoundException;
import com.taynote.api.exception.column.ColumnNotEmptyException;
import com.taynote.api.exception.column.ColumnNotFoundException;
import com.taynote.api.mapper.ColumnMapper;
import com.taynote.api.repository.BoardRepository;
import com.taynote.api.repository.ColumnRepository;
import com.taynote.api.repository.TaskRepository;

@Service
public class ColumnService {

    private final ColumnRepository columnRepository;
    private final TaskRepository taskRepository;
    private final BoardRepository boardRepository;

    public ColumnService(ColumnRepository columnRepository, TaskRepository taskRepository,
            BoardRepository boardRepository) {
        this.columnRepository = columnRepository;
        this.taskRepository = taskRepository;
        this.boardRepository = boardRepository;
    }

    public List<BoardColumn> findAll(UUID boardId) {
        return columnRepository.findByBoard_IdOrderByOrderNoAsc(boardId);
    }

    public CreateColumnResponse create(CreateColumnRequest request) {
        Board board = findBoard(request.getBoardId());
        BoardColumn column = new BoardColumn();
        column.setName(request.getName());
        column.setOrderNo(nextOrderNo(board.getId()));
        column.setBoard(board);
        return ColumnMapper.toCreateResponse(columnRepository.save(column));
    }

    public UpdateColumnResponse update(UUID id, UpdateColumnRequest request) {
        BoardColumn column = columnRepository.findById(id).orElseThrow(() -> new ColumnNotFoundException(id));
        if (request.getName() != null) {
            column.setName(request.getName());
        }
        return ColumnMapper.toUpdateResponse(columnRepository.save(column));
    }

    public UpdateColumnResponse move(UUID id, int targetIndex) {
        BoardColumn column = columnRepository.findById(id).orElseThrow(() -> new ColumnNotFoundException(id));

        List<BoardColumn> columns = columnRepository.findByBoard_IdOrderByOrderNoAsc(column.getBoard().getId());
        columns.removeIf(c -> c.getId().equals(id));

        int index = Math.max(0, Math.min(targetIndex, columns.size()));
        columns.add(index, column);

        for (int i = 0; i < columns.size(); i++) {
            columns.get(i).setOrderNo(i);
        }
        columnRepository.saveAll(columns);

        return ColumnMapper.toUpdateResponse(column);
    }

    public void delete(UUID id) {
        if (!columnRepository.existsById((id))) {
            throw new ColumnNotFoundException(id);
        }
        if (taskRepository.existsByColumn_Id(id)) {
            throw new ColumnNotEmptyException(id);
        }

        columnRepository.deleteById(id);
    }

    private int nextOrderNo(UUID boardId) {
        return columnRepository.findByBoard_IdOrderByOrderNoAsc(boardId).stream()
                .mapToInt(BoardColumn::getOrderNo)
                .max()
                .orElse(-1) + 1;
    }

    private Board findBoard(UUID boardId) {
        return boardRepository.findById(boardId).orElseThrow(() -> new BoardNotFoundException(boardId));
    }
}
