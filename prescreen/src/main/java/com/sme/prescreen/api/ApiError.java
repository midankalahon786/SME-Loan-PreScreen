package com.sme.prescreen.api;

import lombok.Builder;
import lombok.Getter;

import java.time.Instant;
import java.util.List;

@Getter
@Builder
public class ApiError {

    private boolean success;
    private String message;
    private List<String> errors;
    private int status;
    private Instant timestamp;
}
