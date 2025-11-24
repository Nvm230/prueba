package com.univibe.user.web;

import com.univibe.common.dto.PageResponse;
import com.univibe.user.dto.UpdateProfileRequest;
import com.univibe.user.model.Role;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import com.univibe.gamification.event.ProfileUpdatedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.util.StringUtils;


@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository userRepository;
    private final ApplicationEventPublisher publisher;

    public UserController(UserRepository userRepository, ApplicationEventPublisher publisher) {
        this.userRepository = userRepository;
        this.publisher = publisher;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public PageResponse<User> list(
            @RequestParam Optional<String> search,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return search.filter(StringUtils::hasText)
                .map(String::trim)
                .map(query -> PageResponse.from(userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query, pageable)))
                .orElseGet(() -> PageResponse.from(userRepository.findAll(pageable)));
    }

    @GetMapping("/me")
    public User me(Authentication auth) {
        return userRepository.findByEmail((String) auth.getPrincipal()).orElseThrow();
    }

    @PutMapping("/me")
    public User updateMe(Authentication auth, @RequestBody @Valid UpdateProfileRequest request) {
        User user = userRepository.findByEmail((String) auth.getPrincipal()).orElseThrow();
        user.setName(request.name());
        user.setPreferredCategories(request.preferredCategories());
        if (request.profilePictureUrl() != null) {
            user.setProfilePictureUrl(request.profilePictureUrl());
        }
        User savedUser = userRepository.save(user);
        
        // Publish event for achievements
        boolean hasPhoto = savedUser.getProfilePictureUrl() != null && !savedUser.getProfilePictureUrl().trim().isEmpty();
        boolean isComplete = hasPhoto && savedUser.getName() != null && savedUser.getEmail() != null;
        publisher.publishEvent(new ProfileUpdatedEvent(this, savedUser, hasPhoto, isComplete));
        
        return savedUser;
    }

    @GetMapping("/{userId}")
    public User getById(@PathVariable Long userId, Authentication auth) {
        User requester = userRepository.findByEmail((String) auth.getPrincipal()).orElseThrow();
        if (!requester.getId().equals(userId) && requester.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Forbidden");
        }
        return userRepository.findById(userId).orElseThrow();
    }

    @PostMapping("/{userId}/role")
    @PreAuthorize("hasRole('ADMIN')")
    public User updateRole(@PathVariable Long userId, @RequestParam Role role, Authentication auth) {
        User requester = userRepository.findByEmail((String) auth.getPrincipal()).orElseThrow();
        User u = userRepository.findById(userId).orElseThrow();
        
        // Prevenir que un admin modifique su propio rol
        if (requester.getId().equals(userId) && requester.getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Un administrador no puede modificar su propio rol");
        }
        
        u.setRole(role);
        return userRepository.save(u);
    }
}
