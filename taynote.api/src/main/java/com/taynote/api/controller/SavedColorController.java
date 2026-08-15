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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.taynote.api.dto.savedcolor.SavedColorDto;
import com.taynote.api.dto.savedcolor.request.CreateSavedColorRequest;
import com.taynote.api.mapper.SavedColorMapper;
import com.taynote.api.service.SavedColorService;

@RestController
@RequestMapping("/saved-colors")
public class SavedColorController {

    private final SavedColorService savedColorService;

    public SavedColorController(SavedColorService savedColorService) {
        this.savedColorService = savedColorService;
    }

    @GetMapping
    public List<SavedColorDto> findAll() {
        return savedColorService.findAll().stream().map(SavedColorMapper::toDto).toList();
    }

    @PostMapping
    public ResponseEntity<SavedColorDto> create(@RequestBody CreateSavedColorRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(savedColorService.create(request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        savedColorService.delete(id);
    }
}
