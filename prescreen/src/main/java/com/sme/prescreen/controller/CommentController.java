package com.sme.prescreen.controller;

import com.sme.prescreen.domain.entity.ApplicationComment;
import com.sme.prescreen.domain.entity.User;
import com.sme.prescreen.repository.ApplicationCommentRepository;
import com.sme.prescreen.security.AuthFacade;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications/{applicationId}/comments")
@RequiredArgsConstructor
public class CommentController {

    private final ApplicationCommentRepository commentRepository;
    private final AuthFacade authFacade;

    @GetMapping
    @PreAuthorize("@authFacade.canAccessApplication(#applicationId)")
    public ResponseEntity<List<ApplicationComment>> getComments(@PathVariable Long applicationId) {
        return ResponseEntity.ok(commentRepository.findByApplicationIdOrderByCreatedAtDesc(applicationId));
    }

    @PostMapping
    @PreAuthorize("@authFacade.canAccessApplication(#applicationId)")
    public ResponseEntity<ApplicationComment> addComment(
            @PathVariable Long applicationId,
            @RequestBody Map<String, String> payload) {

        User user = authFacade.getCurrentUser();

        ApplicationComment comment = ApplicationComment.builder()
                .applicationId(applicationId)
                .authorName(user.getFullName())
                .authorRole(user.getRole().name())
                .message(payload.get("message"))
                .build();

        return ResponseEntity.ok(commentRepository.save(comment));
    }
}