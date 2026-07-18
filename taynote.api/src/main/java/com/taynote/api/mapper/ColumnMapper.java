package com.taynote.api.mapper;

import com.taynote.api.dto.column.ColumnDto;
import com.taynote.api.dto.column.response.CreateColumnResponse;
import com.taynote.api.dto.column.response.UpdateColumnResponse;
import com.taynote.api.entity.BoardColumn;

public final class ColumnMapper {

    private ColumnMapper() {
    }

    public static ColumnDto toDto(BoardColumn column) {
        return new ColumnDto(column.getId(), column.getName(), column.getOrderNo(), column.getBoard().getId());
    }

    public static CreateColumnResponse toCreateResponse(BoardColumn column) {
        return new CreateColumnResponse(column.getId(), column.getName(), column.getOrderNo(),
                column.getBoard().getId());
    }

    public static UpdateColumnResponse toUpdateResponse(BoardColumn column) {
        return new UpdateColumnResponse(column.getId(), column.getName(), column.getOrderNo());
    }
}
