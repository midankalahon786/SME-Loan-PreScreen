package com.sme.prescreen.domain.dto;

import com.sme.prescreen.domain.enums.DocumentStatus;
import com.sme.prescreen.domain.enums.DocumentType;
import lombok.Builder;
import lombok.Getter;

import java.time.Instant;

@Getter
@Builder
public class ApplicationDocumentDto {

    private Long id;
    private DocumentType docType;
    private String docDisplayName;
    private DocumentStatus status;
    private String filePath;
    private Instant uploadedAt;
}
