package com.taynote.api.controller;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taynote.api.dto.ColumnDto;
import com.taynote.api.dto.CreateColumnRequest;
import com.taynote.api.dto.UpdateColumnRequest;
import com.taynote.api.entity.BoardColumn;
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
    public List<ColumnDto> findAll() {
        return columnService.findAll().stream().map(ColumnMapper::toDto).collect(Collectors.toList());
    }

    @PostMapping
    public ResponseEntity<ColumnDto> create(@RequestBody CreateColumnRequest request) {
        BoardColumn column = columnService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ColumnMapper.toDto(column));
    }

    @PatchMapping("/{id}")
    public ColumnDto update(@PathVariable UUID id, @RequestBody UpdateColumnRequest request) {
        return ColumnMapper.toDto(columnService.update(id, request));
    }

    @DeleteMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public UUID delete(@PathVariable UUID id) {
        columnService.delete(id);
        return id;
    }
}
