package com.sme.prescreen.security;

import com.sme.prescreen.domain.entity.Application;
import com.sme.prescreen.domain.entity.User;
import com.sme.prescreen.domain.enums.UserRole;
import com.sme.prescreen.repository.ApplicationRepository;
import com.sme.prescreen.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuthFacade {

    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;

    public User getCurrentUser() {
        String username = SecurityContextHolder.getContext()
                .getAuthentication().getName();

        return userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found: " + username));
    }

    public Long getCurrentUserId() {
        return getCurrentUser().getId();
    }

    public boolean isStaff() {
        return getCurrentUser().getRole() == UserRole.STAFF;
    }

    public boolean canAccessApplication(Long appId) {
        Application app = applicationRepository.findById(appId)
                .orElseThrow(() -> new EntityNotFoundException("Application not found with id " + appId));

        if (isStaff()) return true;

        return app.getOwnerId().equals(getCurrentUserId());
    }
}
