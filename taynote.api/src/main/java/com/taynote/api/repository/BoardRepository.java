package com.taynote.api.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taynote.api.entity.Board;

public interface BoardRepository extends JpaRepository<Board, UUID> {

    boolean existsByName(String name);
}
