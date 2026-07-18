package com.taynote.api.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.taynote.api.dto.board.BoardDto;
import com.taynote.api.dto.board.request.CreateBoardRequest;
import com.taynote.api.dto.board.request.UpdateBoardRequest;
import com.taynote.api.dto.board.response.CreateBoardResponse;
import com.taynote.api.dto.board.response.UpdateBoardResponse;
import com.taynote.api.mapper.BoardMapper;
import com.taynote.api.service.BoardService;

@RestController
@RequestMapping("/boards")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping
    public List<BoardDto> findAll() {
        return boardService.findAll().stream().map(BoardMapper::toDto).toList();
    }

    @PostMapping
    public ResponseEntity<CreateBoardResponse> create(@RequestBody CreateBoardRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(boardService.create(request));
    }

    @PatchMapping("/{id}")
    public UpdateBoardResponse update(@PathVariable UUID id, @RequestBody UpdateBoardRequest request) {
        return boardService.update(id, request);
    }

    @DeleteMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        boardService.delete(id);
    }
}
