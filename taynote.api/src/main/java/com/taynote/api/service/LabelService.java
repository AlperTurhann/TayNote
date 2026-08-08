package com.taynote.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.taynote.api.dto.label.request.CreateLabelRequest;
import com.taynote.api.dto.label.response.CreateLabelResponse;
import com.taynote.api.entity.Board;
import com.taynote.api.entity.Label;
import com.taynote.api.exception.board.BoardNotFoundException;
import com.taynote.api.exception.label.LabelNotFoundException;
import com.taynote.api.mapper.LabelMapper;
import com.taynote.api.repository.BoardRepository;
import com.taynote.api.repository.LabelRepository;

@Service
public class LabelService {

    private final LabelRepository labelRepository;
    private final BoardRepository boardRepository;

    public LabelService(LabelRepository labelRepository, BoardRepository boardRepository) {
        this.labelRepository = labelRepository;
        this.boardRepository = boardRepository;
    }

    private Board findBoard(UUID boardId) {
        return boardRepository.findById(boardId).orElseThrow(() -> new BoardNotFoundException(boardId));
    }

    public List<Label> findAll(UUID boardId) {
        if (boardId == null) {
            return labelRepository.findByBoardIsNullOrderByNameAsc();
        }
        return labelRepository.findByBoard_IdOrderByNameAsc(boardId);
    }

    public CreateLabelResponse create(CreateLabelRequest request) {
        Label label = new Label();
        label.setName(request.getName());
        label.setColor(request.getColor());
        if (request.getBoardId() != null) {
            label.setBoard(findBoard(request.getBoardId()));
        }
        return LabelMapper.toCreateResponse(labelRepository.save(label));
    }

    public void delete(UUID id) {
        if (!labelRepository.existsById(id)) {
            throw new LabelNotFoundException(id);
        }
        labelRepository.deleteById(id);
    }
}
