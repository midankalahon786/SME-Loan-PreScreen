package com.sme.prescreen.domain.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class DocSummary {

    private boolean kycComplete;
    private boolean incomeComplete;
    private boolean businessProofComplete;

    private int totalRequiredDocs;
    private int uploadedMandatoryDocs;
    private int missingMandatoryDocs;

    private boolean allMandatoryDocsUploaded;
}
