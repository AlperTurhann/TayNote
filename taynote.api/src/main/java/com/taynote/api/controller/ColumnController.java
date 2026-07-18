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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.taynote.api.dto.column.ColumnDto;
import com.taynote.api.dto.column.request.CreateColumnRequest;
import com.taynote.api.dto.column.request.UpdateColumnRequest;
import com.taynote.api.dto.column.response.CreateColumnResponse;
import com.taynote.api.dto.column.response.UpdateColumnResponse;
import com.taynote.api.mapper.ColumnMapper;
import com.taynote.api.service.ColumnService;

@RestController
@RequestMapping("/columns")
public class ColumnController {

    private final ColumnService columnService;

    public ColumnController(ColumnService columnService) {
        this.columnService = columnService;
    }

    @GetMapping
    public List<ColumnDto> findAll(@RequestParam UUID boardId) {
        return columnService.findAll(boardId).stream().map(ColumnMapper::toDto).toList();
    }

    @PostMapping
    public ResponseEntity<CreateColumnResponse> create(@RequestBody CreateColumnRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(columnService.create(request));
    }

    @PatchMapping("/{id}")
    public UpdateColumnResponse update(@PathVariable UUID id, @RequestBody UpdateColumnRequest request) {
        return columnService.update(id, request);
    }

    @DeleteMapping(value = "/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        columnService.delete(id);
    }
}
