package com.taynote.api.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.taynote.api.dto.savedcolor.SavedColorDto;
import com.taynote.api.dto.savedcolor.request.CreateSavedColorRequest;
import com.taynote.api.entity.SavedColor;
import com.taynote.api.exception.savedcolor.SavedColorAlreadyExistsException;
import com.taynote.api.exception.savedcolor.SavedColorNotFoundException;
import com.taynote.api.mapper.SavedColorMapper;
import com.taynote.api.repository.SavedColorRepository;

@Service
public class SavedColorService {

    private final SavedColorRepository savedColorRepository;

    public SavedColorService(SavedColorRepository savedColorRepository) {
        this.savedColorRepository = savedColorRepository;
    }

    public List<SavedColor> findAll() {
        return savedColorRepository.findAllByOrderByCreatedAtAsc();
    }

    public SavedColorDto create(CreateSavedColorRequest request) {
        if (savedColorRepository.findByName(request.getName()).isPresent()) {
            throw new SavedColorAlreadyExistsException(request.getName());
        }
        SavedColor savedColor = new SavedColor();
        savedColor.setName(request.getName());
        savedColor.setHex(request.getHex());
        return SavedColorMapper.toDto(savedColorRepository.save(savedColor));
    }

    public void delete(UUID id) {
        if (!savedColorRepository.existsById(id)) {
            throw new SavedColorNotFoundException(id);
        }
        savedColorRepository.deleteById(id);
    }
}
