package com.taynote.api.mapper;

import com.taynote.api.dto.board.BoardDto;
import com.taynote.api.dto.board.response.CreateBoardResponse;
import com.taynote.api.dto.board.response.UpdateBoardResponse;
import com.taynote.api.entity.Board;

public final class BoardMapper {

    private BoardMapper() {
    }

    public static BoardDto toDto(Board board) {
        return new BoardDto(board.getId(), board.getName());
    }

    public static CreateBoardResponse toCreateResponse(Board board) {
        return new CreateBoardResponse(board.getId(), board.getName());
    }

    public static UpdateBoardResponse toUpdateResponse(Board board) {
        return new UpdateBoardResponse(board.getId(), board.getName());
    }
}
