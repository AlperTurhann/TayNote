package com.taynote.api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taynote.api.entity.Label;

import jakarta.transaction.Transactional;

public interface LabelRepository extends JpaRepository<Label, UUID> {

    List<Label> findByBoardIsNullOrderByNameAsc();

    List<Label> findByBoard_IdOrderByNameAsc(UUID boardId);

    @Transactional
    void deleteByBoard_Id(UUID boardId);
}
