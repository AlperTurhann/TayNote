package com.taynote.api.mapper;

import com.taynote.api.dto.savedcolor.SavedColorDto;
import com.taynote.api.entity.SavedColor;

public final class SavedColorMapper {

    private SavedColorMapper() {
    }

    public static SavedColorDto toDto(SavedColor savedColor) {
        return new SavedColorDto(savedColor.getId(), savedColor.getName(), savedColor.getHex());
    }
}
