package com.taynote.api.entity;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Status {
    PRODUCT_BACKLOG("Product Backlog"),
    TO_DO("To Do"),
    IN_PROGRESS("In Progress"),
    TECHNICAL_REVIEW("Technical Review"),
    QA_TEST("QA Test"),
    UAT_TEST("UAT Test"),
    TEST_FAILED("Test Failed"),
    BLOCKED("Blocked"),
    DONE("Done"),
    CANCELLED("Cancelled");

    private final String label;

    Status(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static Status fromLabel(String label) {
        for (Status status : values()) {
            if (status.label.equals(label)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown status: " + label);
    }
}
