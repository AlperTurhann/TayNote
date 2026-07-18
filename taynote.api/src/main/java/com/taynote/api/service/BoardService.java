package com.taynote.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.taynote.api.dto.board.request.CreateBoardRequest;
import com.taynote.api.dto.board.request.UpdateBoardRequest;
import com.taynote.api.dto.board.response.CreateBoardResponse;
import com.taynote.api.dto.board.response.UpdateBoardResponse;
import com.taynote.api.entity.Board;
import com.taynote.api.exception.board.BoardAlreadyExistsException;
import com.taynote.api.exception.board.BoardNotFoundException;
import com.taynote.api.mapper.BoardMapper;
import com.taynote.api.repository.BoardRepository;
import com.taynote.api.repository.ColumnRepository;
import com.taynote.api.repository.TaskRepository;

import jakarta.transaction.Transactional;

@Service
public class BoardService {

    private final BoardRepository boardRepository;
    private final ColumnRepository columnRepository;
    private final TaskRepository taskRepository;

    public BoardService(BoardRepository boardRepository, ColumnRepository columnRepository,
            TaskRepository taskRepository) {
        this.boardRepository = boardRepository;
        this.columnRepository = columnRepository;
        this.taskRepository = taskRepository;
    }

    public List<Board> findAll() {
        return boardRepository.findAll();
    }

    public CreateBoardResponse create(CreateBoardRequest request) {
        Board board = new Board();
        board.setName(request.getName());
        return BoardMapper.toCreateResponse(boardRepository.save(board));
    }

    public UpdateBoardResponse update(UUID id, UpdateBoardRequest request) {
        Board board = boardRepository.findById(id).orElseThrow(() -> new BoardNotFoundException(id));
        if (boardRepository.existsByName(request.getName())) {
            throw new BoardAlreadyExistsException(request.getName());
        }
        if (request.getName() != null) {
            board.setName(request.getName());
        }
        return BoardMapper.toUpdateResponse(boardRepository.save(board));
    }

    @Transactional
    public void delete(UUID id) {
        if (!boardRepository.existsById(id)) {
            throw new BoardNotFoundException(id);
        }

        taskRepository.deleteByColumn_Board_Id(id);
        columnRepository.deleteByBoard_Id(id);
        boardRepository.deleteById(id);
    }
}
