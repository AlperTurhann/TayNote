package com.taynote.api.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taynote.api.entity.SavedColor;

public interface SavedColorRepository extends JpaRepository<SavedColor, UUID> {

    List<SavedColor> findAllByOrderByCreatedAtAsc();

    Optional<SavedColor> findByName(String name);
}
