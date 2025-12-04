package com.sme.prescreen.config;

import com.sme.prescreen.domain.entity.Application;
import com.sme.prescreen.domain.entity.ApplicationDocument;
import com.sme.prescreen.domain.entity.User;
import com.sme.prescreen.domain.enums.*;
import com.sme.prescreen.repository.ApplicationDocumentRepository;
import com.sme.prescreen.repository.ApplicationRepository;
import com.sme.prescreen.repository.UserRepository;
import com.sme.prescreen.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.util.Objects;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final ApplicationDocumentRepository documentRepository;
    private final PasswordEncoder passwordEncoder;
    private final ApplicationService applicationService;

    @Override
    public void run(String... args) throws Exception {
        // Clear this check if you want to force-run it, otherwise keep it
        if (userRepository.count() > 0) {
            log.info("Data already initialized. Skipping...");
            return;
        }

        log.info("Initializing Demo Data...");

        // 1. Create Demo Users
        User staff = createUser("STAFF-1", "Bank Manager", "staff@hdfc.com", UserRole.STAFF);
        User applicant = createUser("APPLICANT-DEMO", "Demo Applicant", "demo@sme.com", UserRole.APPLICANT);

        // 2. Read CSV
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(Objects.requireNonNull(getClass().getResourceAsStream("/loan_data.csv"))))) {

            String line;
            boolean header = true;
            while ((line = reader.readLine()) != null) {
                if (header) { header = false; continue; }

                // Fix: Handle comma inside quotes or simple split
                String[] cols = line.split(",");

                // Fix: Ensure we have enough columns (We expect 9)
                if (cols.length < 9) continue;

                // --- CORRECTED INDICES (Shifted by -1) ---
                // 0: S.No
                // 1: Applicant ID
                // 2: Industry
                // 3: Amount
                // 4: Loan Category
                // 5: Applicant Category (Turnover)
                // 6: Income Submitted
                // 7: KYC Submitted
                // 8: Business Proof Submitted

                String losId = cols[1].trim();
                String industry = cols[2].trim();
                String amountStr = cols[3].trim();
                String category = cols[5].trim(); // Index 5 is 'Applicant Category'

                boolean incomeSubmitted = cols[6].trim().equalsIgnoreCase("Yes");
                boolean kycSubmitted = cols[7].trim().equalsIgnoreCase("Yes");
                // Index 8 is the last one (Length 9)
                boolean businessSubmitted = cols[8].trim().equalsIgnoreCase("Yes");

                createApplication(applicant, losId, industry, amountStr, category, incomeSubmitted, kycSubmitted, businessSubmitted);
            }
        } catch (Exception e) {
            log.error("Error parsing CSV: " + e.getMessage());
            e.printStackTrace();
        }
        log.info("Demo Data Initialized Successfully!");
    }

    private User createUser(String username, String name, String email, UserRole role) {
        return userRepository.save(User.builder()
                .username(username)
                .fullName(name)
                .email(email)
                .password(passwordEncoder.encode("password123"))
                .role(role)
                .build());
    }

    private void createApplication(User owner, String losId, String industry, String amount, String category,
                                   boolean income, boolean kyc, boolean business) {

        String band = switch (category) {
            case "Large" -> "5Cr+";
            case "Medium" -> "1Cr-5Cr";
            default -> "0-50L";
        };

        Application app = Application.builder()
                .applicantName(losId + " " + industry + " Corp")
                .businessType(industry.equalsIgnoreCase("Trading") ? "PROPRIETORSHIP" : "PVT_LTD")
                .turnoverBand(band)
                .requestedLoanAmount(new BigDecimal(amount))
                .yearsInBusiness(3)
                .losApplicationId(losId)
                .ownerId(owner.getId())
                .eligibilityStatus(EligibilityStatus.PENDING)
                .preScreenResult(PreScreenResult.BLOCKED_MISSING_DOCS)
                .build();

        app = applicationRepository.save(app);

        if (kyc) uploadDocsForCategory(app, DocumentCategory.KYC);
        if (income) uploadDocsForCategory(app, DocumentCategory.INCOME_PROOF);
        if (business) uploadDocsForCategory(app, DocumentCategory.BUSINESS_PROOF);

        applicationService.evaluatePreScreen(app.getId());
    }

    private void uploadDocsForCategory(Application app, DocumentCategory category) {
        for (DocumentType type : DocumentType.values()) {
            if (type.getCategory() == category && type.isMandatory()) {
                documentRepository.save(ApplicationDocument.builder()
                        .application(app)
                        .docType(type)
                        .status(DocumentStatus.UPLOADED)
                        .filePath("dummy_" + type.name() + ".pdf")
                        .build());
            }
        }
    }
}