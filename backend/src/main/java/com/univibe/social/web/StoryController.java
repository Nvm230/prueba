package com.univibe.social.web;

import com.univibe.common.exception.NotFoundException;
import com.univibe.social.model.Story;
import com.univibe.social.repo.FriendshipRepository;
import com.univibe.social.repo.StoryRepository;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/stories")
public class StoryController {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;

    public StoryController(StoryRepository storyRepository, UserRepository userRepository, FriendshipRepository friendshipRepository) {
        this.storyRepository = storyRepository;
        this.userRepository = userRepository;
        this.friendshipRepository = friendshipRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createStory(
            @RequestBody Map<String, String> request,
            Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        
        Story story = new Story();
        story.setUser(user);
        String mediaUrl = request.get("mediaUrl");
        if (mediaUrl != null && !mediaUrl.trim().isEmpty()) {
            story.setMediaUrl(mediaUrl);
            story.setMediaType(request.get("mediaType") != null ? request.get("mediaType") : "IMAGE");
        }
        story.setMusicUrl(request.get("musicUrl"));
        story.setCaption(request.get("caption"));
        story.setCreatedAt(Instant.now());
        story.setExpiresAt(Instant.now().plus(24, ChronoUnit.HOURS));
        story.setActive(true);
        
        story = storyRepository.save(story);
        
        Map<String, Object> responseMap = new java.util.HashMap<>();
        responseMap.put("id", story.getId());
        responseMap.put("mediaUrl", story.getMediaUrl() != null ? story.getMediaUrl() : "");
        responseMap.put("mediaType", story.getMediaType() != null ? story.getMediaType() : "");
        responseMap.put("musicUrl", story.getMusicUrl() != null ? story.getMusicUrl() : "");
        responseMap.put("caption", story.getCaption() != null ? story.getCaption() : "");
        responseMap.put("createdAt", story.getCreatedAt().toString());
        responseMap.put("expiresAt", story.getExpiresAt().toString());
        responseMap.put("user", Map.of(
                "id", story.getUser().getId(),
                "name", story.getUser().getName(),
                "profilePictureUrl", story.getUser().getProfilePictureUrl() != null ? story.getUser().getProfilePictureUrl() : ""
        ));
        return ResponseEntity.ok(responseMap);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Map<String, Object>>> getMyStories(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        List<Story> stories = storyRepository.findByUserAndIsActiveTrueAndExpiresAtAfter(user, Instant.now());
        
        return ResponseEntity.ok(stories.stream()
                .map(s -> Map.of(
                        "id", s.getId(),
                        "mediaUrl", s.getMediaUrl() != null ? s.getMediaUrl() : "",
                        "mediaType", s.getMediaType() != null ? s.getMediaType() : "",
                        "musicUrl", s.getMusicUrl() != null ? s.getMusicUrl() : "",
                        "caption", s.getCaption() != null ? s.getCaption() : "",
                        "createdAt", s.getCreatedAt().toString(),
                        "expiresAt", s.getExpiresAt().toString(),
                        "user", Map.of(
                                "id", s.getUser().getId(),
                                "name", s.getUser().getName(),
                                "profilePictureUrl", s.getUser().getProfilePictureUrl() != null ? s.getUser().getProfilePictureUrl() : ""
                        )
                ))
                .collect(Collectors.toList()));
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllStories(Authentication auth) {
        User currentUser = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        
        // Obtener todas las historias activas
        List<Story> allStories = storyRepository.findByIsActiveTrueAndExpiresAtAfter(Instant.now());
        
        // Filtrar solo historias de amigos o del usuario actual
        List<Story> filteredStories = allStories.stream()
                .filter(story -> {
                    // El usuario puede ver sus propias historias
                    if (story.getUser().getId().equals(currentUser.getId())) {
                        return true;
                    }
                    // Verificar si son amigos (bidireccional)
                    boolean areFriends = friendshipRepository.existsByUser1IdAndUser2Id(
                            currentUser.getId(), story.getUser().getId()) ||
                            friendshipRepository.existsByUser1IdAndUser2Id(
                                    story.getUser().getId(), currentUser.getId());
                    return areFriends;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(filteredStories.stream()
                .map(s -> Map.of(
                        "id", s.getId(),
                        "mediaUrl", s.getMediaUrl() != null ? s.getMediaUrl() : "",
                        "mediaType", s.getMediaType() != null ? s.getMediaType() : "",
                        "musicUrl", s.getMusicUrl() != null ? s.getMusicUrl() : "",
                        "caption", s.getCaption() != null ? s.getCaption() : "",
                        "createdAt", s.getCreatedAt().toString(),
                        "expiresAt", s.getExpiresAt().toString(),
                        "user", Map.of(
                                "id", s.getUser().getId(),
                                "name", s.getUser().getName(),
                                "profilePictureUrl", s.getUser().getProfilePictureUrl() != null ? s.getUser().getProfilePictureUrl() : ""
                        )
                ))
                .collect(Collectors.toList()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStory(@PathVariable Long id, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        Story story = storyRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Historia no encontrada"));
        
        if (!story.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        story.setActive(false);
        storyRepository.save(story);
        return ResponseEntity.noContent().build();
    }
}

