package com.sme.prescreen.domain.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
@Schema(description = "Request payload to create or update an SME loan application")
public class ApplicationRequestDto {

    @NotBlank
    @Schema(example = "ABC Traders")
    private String applicantName;

    @NotBlank
    @Schema(example = "PROPRIETORSHIP")
    private String businessType;

    @NotBlank
    @Schema(example = "0-50L")
    private String turnoverBand;

    @NotNull
    @DecimalMin(value = "10000.00")
    @Schema(example = "200000.00")
    private BigDecimal requestedLoanAmount;

    @NotNull
    @Min(0)
    @Schema(example = "3")
    private Integer yearsInBusiness;
}
