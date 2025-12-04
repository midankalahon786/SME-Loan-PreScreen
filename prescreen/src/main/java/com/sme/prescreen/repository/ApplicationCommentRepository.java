package com.sme.prescreen.repository;

import com.sme.prescreen.domain.entity.ApplicationComment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationCommentRepository extends JpaRepository<ApplicationComment, Long> {
    List<ApplicationComment> findByApplicationIdOrderByCreatedAtDesc(Long applicationId);
}