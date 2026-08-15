package com.taynote.api.dto.savedcolor.request;

public class CreateSavedColorRequest {

    private String name;
    private String hex;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getHex() {
        return hex;
    }

    public void setHex(String hex) {
        this.hex = hex;
    }
}
