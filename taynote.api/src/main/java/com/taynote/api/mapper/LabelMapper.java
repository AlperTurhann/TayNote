package com.taynote.api.mapper;

import java.util.UUID;

import com.taynote.api.dto.label.LabelDto;
import com.taynote.api.dto.label.response.CreateLabelResponse;
import com.taynote.api.entity.Label;

public final class LabelMapper {

    private LabelMapper() {
    }

    public static LabelDto toDto(Label label) {
        return new LabelDto(label.getId(), label.getName(), label.getColor(), boardId(label));
    }

    public static CreateLabelResponse toCreateResponse(Label label) {
        return new CreateLabelResponse(label.getId(), label.getName(), label.getColor(), boardId(label));
    }

    private static UUID boardId(Label label) {
        return label.getBoard() == null ? null : label.getBoard().getId();
    }
}
