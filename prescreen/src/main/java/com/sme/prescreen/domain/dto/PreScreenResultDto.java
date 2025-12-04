package com.sme.prescreen.domain.dto;

import com.sme.prescreen.domain.enums.EligibilityStatus;
import com.sme.prescreen.domain.enums.PreScreenResult;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@Schema(description = "Result of pre-screen evaluation combining eligibility rules and document completeness.")
public class PreScreenResultDto {

    @Schema(example = "1")
    private Long applicationId;

    @Schema(example = "ELIGIBLE")
    private EligibilityStatus eligibilityStatus;

    @Schema(example = "READY")
    private PreScreenResult preScreenResult;

    @Schema(description = "List of reasons if the application is ineligible or blocked",
            example = "[\"BUSINESS_TOO_NEW\", \"TURNOVER_TOO_LOW\"]")
    private List<String> eligibilityReasons;

    @Schema(example = "6")
    private int totalRequiredDocs;

    @Schema(example = "6")
    private int uploadedMandatoryDocs;

    @Schema(example = "0")
    private int missingMandatoryDocs;

    @Schema(example = "true")
    private boolean allMandatoryDocsUploaded;
}
