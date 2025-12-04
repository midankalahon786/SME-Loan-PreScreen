package com.sme.prescreen.domain.entity;

import com.sme.prescreen.domain.enums.EligibilityStatus;
import com.sme.prescreen.domain.enums.PreScreenResult;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic applicant/business info
    @Column(nullable = false)
    private String applicantName;

    @Column(nullable = false)
    private String businessType;          // e.g. "PROPRIETORSHIP", "PVT_LTD"

    @Column(nullable = false)
    private String turnoverBand;          // e.g. "0-50L", "50L-1Cr"

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal requestedLoanAmount;

    @Column(nullable = false)
    private Integer yearsInBusiness;

    // Eligibility + pre-screen status
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EligibilityStatus eligibilityStatus;   // ELIGIBLE / INELIGIBLE / PENDING

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PreScreenResult preScreenResult;       // READY / BLOCKED_MISSING_DOCS / BLOCKED_INELIGIBLE

    // Integration with LOS (core loan system)
    private String losApplicationId;

    // Audit fields
    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    @Column(nullable = false)
    private boolean lockedByStaff = false;

    @Column(nullable = false)
    private Long ownerId;    // ID of the applicant user

    // Later: map documents here
}
