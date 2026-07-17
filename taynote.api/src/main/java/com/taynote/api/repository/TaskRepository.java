package com.taynote.api.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.taynote.api.entity.Task;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    Page<Task> findByTitleContainingIgnoreCase(String query, Pageable pageable);

    Page<Task> findByColumn_IdAndTitleContainingIgnoreCase(UUID columnId, String query, Pageable pageable);

    boolean existsByColumn_Id(UUID columnId);
}
