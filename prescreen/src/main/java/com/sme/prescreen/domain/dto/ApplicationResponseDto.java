package com.sme.prescreen.domain.dto;

import com.sme.prescreen.domain.enums.EligibilityStatus;
import com.sme.prescreen.domain.enums.PreScreenResult;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@Schema(description = "Response DTO representing an SME loan application")
public class ApplicationResponseDto {

    @Schema(example = "1")
    private Long id;

    @Schema(example = "ABC Traders")
    private String applicantName;

    @Schema(example = "PROPRIETORSHIP")
    private String businessType;

    @Schema(example = "0-50L")
    private String turnoverBand;

    @Schema(example = "200000.00")
    private BigDecimal requestedLoanAmount;

    @Schema(example = "3")
    private Integer yearsInBusiness;

    @Schema(example = "PENDING")
    private EligibilityStatus eligibilityStatus;

    @Schema(example = "BLOCKED_MISSING_DOCS")
    private PreScreenResult preScreenResult;

    @Schema(example = "LOS-2025-000123")
    private String losApplicationId;

    private Instant createdAt;
    private Instant updatedAt;
}
