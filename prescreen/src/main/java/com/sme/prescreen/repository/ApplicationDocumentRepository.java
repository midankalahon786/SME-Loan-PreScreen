package com.sme.prescreen.repository;

import com.sme.prescreen.domain.entity.ApplicationDocument;
import com.sme.prescreen.domain.enums.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationDocumentRepository extends JpaRepository<ApplicationDocument, Long> {

    boolean existsByApplicationIdAndDocType(Long applicationId, DocumentType docType);

    List<ApplicationDocument> findByApplicationId(Long applicationId);
}
