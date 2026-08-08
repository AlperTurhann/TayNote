package com.taynote.api.repository;

import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.taynote.api.entity.Task;

import jakarta.transaction.Transactional;

public interface TaskRepository extends JpaRepository<Task, UUID> {

    Page<Task> findByTitleContainingIgnoreCase(String query, Pageable pageable);

    Page<Task> findByColumn_IdAndTitleContainingIgnoreCase(UUID columnId, String query, Pageable pageable);

    // Matches tasks that have at least one of the given labels (OR semantics).
    @Query(value = "SELECT DISTINCT t FROM Task t JOIN t.labels l "
            + "WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) AND l.id IN :labelIds",
            countQuery = "SELECT COUNT(DISTINCT t) FROM Task t JOIN t.labels l "
                    + "WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) AND l.id IN :labelIds")
    Page<Task> findByTitleContainingIgnoreCaseAndLabels_IdIn(@Param("query") String query,
            @Param("labelIds") List<UUID> labelIds, Pageable pageable);

    @Query(value = "SELECT DISTINCT t FROM Task t JOIN t.labels l "
            + "WHERE t.column.id = :columnId AND LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) "
            + "AND l.id IN :labelIds",
            countQuery = "SELECT COUNT(DISTINCT t) FROM Task t JOIN t.labels l "
                    + "WHERE t.column.id = :columnId AND LOWER(t.title) LIKE LOWER(CONCAT('%', :query, '%')) "
                    + "AND l.id IN :labelIds")
    Page<Task> findByColumn_IdAndTitleContainingIgnoreCaseAndLabels_IdIn(@Param("columnId") UUID columnId,
            @Param("query") String query, @Param("labelIds") List<UUID> labelIds, Pageable pageable);

    List<Task> findByColumn_IdOrderByOrderNoAscCreatedAtDesc(UUID columnId);

    boolean existsByColumn_Id(UUID columnId);

    @Transactional
    void deleteByColumn_Board_Id(UUID boardId);
}
