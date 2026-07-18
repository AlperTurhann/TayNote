package com.taynote.api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taynote.api.entity.BoardColumn;

import jakarta.transaction.Transactional;

public interface ColumnRepository extends JpaRepository<BoardColumn, UUID> {

    List<BoardColumn> findByBoard_IdOrderByOrderNoAsc(UUID boardId);

    @Transactional
    void deleteByBoard_Id(UUID boardId);
}
