package com.taynote.api.mapper;

import com.taynote.api.dto.ColumnDto;
import com.taynote.api.entity.BoardColumn;

public final class ColumnMapper {

    private ColumnMapper() {
    }

    public static ColumnDto toDto(BoardColumn column) {
        return new ColumnDto(column.getId(), column.getName(), column.getOrderNo());
    }
}
