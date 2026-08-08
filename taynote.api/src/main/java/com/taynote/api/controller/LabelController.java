package com.taynote.api.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.taynote.api.dto.label.LabelDto;
import com.taynote.api.dto.label.request.CreateLabelRequest;
import com.taynote.api.dto.label.response.CreateLabelResponse;
import com.taynote.api.mapper.LabelMapper;
import com.taynote.api.service.LabelService;

@RestController
@RequestMapping("/labels")
public class LabelController {

    private final LabelService labelService;

    public LabelController(LabelService labelService) {
        this.labelService = labelService;
    }

    // No boardId -> global labels. With boardId -> that board's own labels only.
    @GetMapping
    public List<LabelDto> findAll(@RequestParam(required = false) UUID boardId) {
        return labelService.findAll(boardId).stream().map(LabelMapper::toDto).toList();
    }

    @PostMapping
    public ResponseEntity<CreateLabelResponse> create(@RequestBody CreateLabelRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(labelService.create(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        labelService.delete(id);
    }
}
