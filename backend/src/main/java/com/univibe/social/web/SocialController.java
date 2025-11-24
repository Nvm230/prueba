package com.univibe.social.web;

import com.univibe.registration.service.QrService;
import com.univibe.social.dto.UserProfileResponse;
import com.univibe.social.repo.PostRepository;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/social")
public class SocialController {
    private final UserRepository userRepository;
    private final QrService qrService;
    private final PostRepository postRepository;

    public SocialController(UserRepository userRepository, QrService qrService, PostRepository postRepository) {
        this.userRepository = userRepository;
        this.qrService = qrService;
        this.postRepository = postRepository;
    }

    @GetMapping("/profile/{userId}")
    public UserProfileResponse getProfile(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        // Generar QR con el ID del usuario
        String qrPayload = String.valueOf(user.getId());
        String qrBase64 = qrService.generateBase64Png(qrPayload);
        
        // Calcular likes totales del usuario
        long totalLikes = postRepository.findByUserOrderByCreatedAtDesc(user, org.springframework.data.domain.Pageable.unpaged())
                .getContent()
                .stream()
                .mapToLong(post -> post.getLikedBy().size())
                .sum();
        
        return new UserProfileResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getPoints(),
            qrBase64,
            user.getProfilePictureUrl(),
            totalLikes
        );
    }

    @GetMapping("/profile/me")
    public UserProfileResponse getMyProfile(Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        String qrPayload = String.valueOf(user.getId());
        String qrBase64 = qrService.generateBase64Png(qrPayload);
        
        // Calcular likes totales del usuario
        long totalLikes = postRepository.findByUserOrderByCreatedAtDesc(user, org.springframework.data.domain.Pageable.unpaged())
                .getContent()
                .stream()
                .mapToLong(post -> post.getLikedBy().size())
                .sum();
        
        return new UserProfileResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getPoints(),
            qrBase64,
            user.getProfilePictureUrl(),
            totalLikes
        );
    }

    @GetMapping("/search")
    public List<Map<String, Object>> searchUsers(@RequestParam String email, Authentication auth) {
        String requesterEmail = (String) auth.getPrincipal();
        User requester = userRepository.findByEmail(requesterEmail).orElseThrow();
        
        return userRepository.findByEmailContainingIgnoreCase(email).stream()
            .filter(u -> !u.getId().equals(requester.getId()))
            .map(u -> {
                Map<String, Object> result = new HashMap<>();
                result.put("id", u.getId());
                result.put("name", u.getName());
                result.put("email", u.getEmail());
                result.put("profilePictureUrl", u.getProfilePictureUrl() != null ? u.getProfilePictureUrl() : "");
                return result;
            })
            .collect(Collectors.toList());
    }

    @PostMapping("/scan-qr")
    public Map<String, Object> scanQr(@RequestBody Map<String, String> body, Authentication auth) {
        String qrData = body.get("qrData");
        if (qrData == null || qrData.isBlank()) {
            throw new IllegalArgumentException("QR data is required");
        }
        
        // Decodificar el QR (puede ser base64 o texto plano con el ID)
        Long userId;
        try {
            // Intentar decodificar como base64
            String decoded = new String(Base64.getUrlDecoder().decode(qrData));
            userId = Long.parseLong(decoded);
        } catch (Exception e) {
            // Si falla, intentar como número directo
            try {
                userId = Long.parseLong(qrData);
            } catch (NumberFormatException ex) {
                throw new IllegalArgumentException("Invalid QR code format");
            }
        }
        
        User user = userRepository.findById(userId).orElseThrow();
        String requesterEmail = (String) auth.getPrincipal();
        User requester = userRepository.findByEmail(requesterEmail).orElseThrow();
        
        if (requester.getId().equals(userId)) {
            throw new IllegalArgumentException("Cannot add yourself as friend");
        }
        
        return Map.of(
            "id", user.getId(),
            "name", user.getName(),
            "email", user.getEmail(),
            "profilePictureUrl", user.getProfilePictureUrl() != null ? user.getProfilePictureUrl() : ""
        );
    }
}

