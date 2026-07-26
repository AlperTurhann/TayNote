package com.taynote.api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.taynote.api.entity.Task;

import jakarta.transaction.Transactional;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    Page<Task> findByTitleContainingIgnoreCase(String query, Pageable pageable);

    Page<Task> findByColumn_IdAndTitleContainingIgnoreCase(UUID columnId, String query, Pageable pageable);

    List<Task> findByColumn_IdOrderByOrderNoAscCreatedAtDesc(UUID columnId);

    boolean existsByColumn_Id(UUID columnId);

    @Transactional
    void deleteByColumn_Board_Id(UUID boardId);
}
