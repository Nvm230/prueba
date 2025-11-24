package com.univibe.social.web;

import com.univibe.common.dto.PageResponse;
import com.univibe.common.exception.NotFoundException;
import com.univibe.social.model.Comment;
import com.univibe.social.model.Post;
import com.univibe.social.repo.CommentRepository;
import com.univibe.social.repo.PostRepository;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public PostController(PostRepository postRepository, UserRepository userRepository, CommentRepository commentRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPost(
            @RequestBody Map<String, String> request,
            Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        
        String musicUrl = request.get("musicUrl");
        if (musicUrl != null && musicUrl.trim().isEmpty()) {
            musicUrl = null;
        }
        
        Post post = new Post();
        post.setUser(user);
        post.setContent(request.get("content"));
        post.setMediaUrl(request.get("mediaUrl"));
        post.setMediaType(request.get("mediaType"));
        post.setMusicUrl(musicUrl);
        post.setCreatedAt(Instant.now());
        post.setUpdatedAt(Instant.now());
        
        post = postRepository.save(post);
        
        System.out.println("[POST] Created post with musicUrl: " + post.getMusicUrl());
        
        Map<String, Object> responseMap = new java.util.HashMap<>();
        responseMap.put("id", post.getId());
        responseMap.put("content", post.getContent());
        responseMap.put("mediaUrl", post.getMediaUrl() != null && !post.getMediaUrl().trim().isEmpty() ? post.getMediaUrl() : null);
        responseMap.put("mediaType", post.getMediaType() != null && !post.getMediaType().trim().isEmpty() ? post.getMediaType() : null);
        responseMap.put("musicUrl", post.getMusicUrl() != null && !post.getMusicUrl().trim().isEmpty() ? post.getMusicUrl() : null);
        responseMap.put("likesCount", post.getLikedBy().size());
        responseMap.put("isLiked", false);
        responseMap.put("createdAt", post.getCreatedAt().toString());
        responseMap.put("user", Map.of(
                "id", post.getUser().getId(),
                "name", post.getUser().getName(),
                "profilePictureUrl", post.getUser().getProfilePictureUrl() != null ? post.getUser().getProfilePictureUrl() : ""
        ));
        return ResponseEntity.ok(responseMap);
    }

    @GetMapping
    public ResponseEntity<PageResponse<Map<String, Object>>> getAllPosts(
            @PageableDefault(size = 20) Pageable pageable,
            Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        Page<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        
        PageResponse<Map<String, Object>> response = new PageResponse<>(
                posts.getContent().stream()
                        .map(p -> {
                            Map<String, Object> postMap = new java.util.HashMap<>();
                            postMap.put("id", p.getId());
                            postMap.put("content", p.getContent());
                            postMap.put("mediaUrl", p.getMediaUrl() != null && !p.getMediaUrl().trim().isEmpty() ? p.getMediaUrl() : null);
                            postMap.put("mediaType", p.getMediaType() != null && !p.getMediaType().trim().isEmpty() ? p.getMediaType() : null);
                            postMap.put("musicUrl", p.getMusicUrl() != null && !p.getMusicUrl().trim().isEmpty() ? p.getMusicUrl() : null);
                            postMap.put("likesCount", p.getLikedBy().size());
                            postMap.put("isLiked", p.getLikedBy().stream().anyMatch(u -> u.getId().equals(user.getId())));
                            postMap.put("createdAt", p.getCreatedAt().toString());
                            postMap.put("user", Map.of(
                                    "id", p.getUser().getId(),
                                    "name", p.getUser().getName(),
                                    "profilePictureUrl", p.getUser().getProfilePictureUrl() != null ? p.getUser().getProfilePictureUrl() : ""
                            ));
                            return postMap;
                        })
                        .collect(Collectors.toList()),
                posts.getTotalElements(),
                posts.getTotalPages(),
                posts.getNumber(),
                posts.getSize()
        );
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable Long id, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Publicación no encontrada"));
        
        boolean isLiked = post.getLikedBy().stream().anyMatch(u -> u.getId().equals(user.getId()));
        if (isLiked) {
            post.getLikedBy().removeIf(u -> u.getId().equals(user.getId()));
        } else {
            post.getLikedBy().add(user);
        }
        
        post.setUpdatedAt(Instant.now());
        post = postRepository.save(post);
        
        return ResponseEntity.ok(Map.of(
                "likesCount", post.getLikedBy().size(),
                "isLiked", !isLiked
        ));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id, Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Publicación no encontrada"));
        
        // Permitir eliminar si es el dueño o si es admin
        if (!post.getUser().getId().equals(user.getId()) && user.getRole() != com.univibe.user.model.Role.ADMIN) {
            return ResponseEntity.status(403).build();
        }
        
        postRepository.delete(post);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<Map<String, Object>> createComment(
            @PathVariable Long id,
            @RequestBody Map<String, String> request,
            Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Publicación no encontrada"));
        
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setUser(user);
        comment.setContent(request.get("content"));
        comment.setCreatedAt(Instant.now());
        comment.setUpdatedAt(Instant.now());
        
        comment = commentRepository.save(comment);
        
        return ResponseEntity.ok(Map.of(
                "id", comment.getId(),
                "content", comment.getContent(),
                "createdAt", comment.getCreatedAt().toString(),
                "user", Map.of(
                        "id", comment.getUser().getId(),
                        "name", comment.getUser().getName(),
                        "profilePictureUrl", comment.getUser().getProfilePictureUrl() != null ? comment.getUser().getProfilePictureUrl() : ""
                )
        ));
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<PageResponse<Map<String, Object>>> getComments(
            @PathVariable Long id,
            @PageableDefault(size = 50) Pageable pageable,
            Authentication auth) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Publicación no encontrada"));
        
        Page<Comment> comments = commentRepository.findByPostIdOrderByCreatedAtAsc(id, pageable);
        
        PageResponse<Map<String, Object>> response = new PageResponse<>(
                comments.getContent().stream()
                        .map(c -> Map.of(
                                "id", c.getId(),
                                "content", c.getContent(),
                                "createdAt", c.getCreatedAt().toString(),
                                "user", Map.of(
                                        "id", c.getUser().getId(),
                                        "name", c.getUser().getName(),
                                        "profilePictureUrl", c.getUser().getProfilePictureUrl() != null ? c.getUser().getProfilePictureUrl() : ""
                                )
                        ))
                        .collect(Collectors.toList()),
                comments.getTotalElements(),
                comments.getTotalPages(),
                comments.getNumber(),
                comments.getSize()
        );
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long postId,
            @PathVariable Long commentId,
            Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new NotFoundException("Comentario no encontrado"));
        
        if (!comment.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).build();
        }
        
        commentRepository.delete(comment);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<PageResponse<Map<String, Object>>> getPostsByUser(
            @PathVariable Long userId,
            @PageableDefault(size = 20) Pageable pageable,
            Authentication auth) {
        User currentUser = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
        
        Page<Post> posts = postRepository.findByUserOrderByCreatedAtDesc(targetUser, pageable);
        
        PageResponse<Map<String, Object>> response = new PageResponse<>(
                posts.getContent().stream()
                        .map(p -> {
                            Map<String, Object> postMap = new java.util.HashMap<>();
                            postMap.put("id", p.getId());
                            postMap.put("content", p.getContent());
                            postMap.put("mediaUrl", p.getMediaUrl() != null && !p.getMediaUrl().trim().isEmpty() ? p.getMediaUrl() : null);
                            postMap.put("mediaType", p.getMediaType() != null && !p.getMediaType().trim().isEmpty() ? p.getMediaType() : null);
                            postMap.put("musicUrl", p.getMusicUrl() != null && !p.getMusicUrl().trim().isEmpty() ? p.getMusicUrl() : null);
                            postMap.put("likesCount", p.getLikedBy().size());
                            postMap.put("isLiked", p.getLikedBy().stream().anyMatch(u -> u.getId().equals(currentUser.getId())));
                            postMap.put("createdAt", p.getCreatedAt().toString());
                            postMap.put("user", Map.of(
                                    "id", p.getUser().getId(),
                                    "name", p.getUser().getName(),
                                    "profilePictureUrl", p.getUser().getProfilePictureUrl() != null ? p.getUser().getProfilePictureUrl() : ""
                            ));
                            return postMap;
                        })
                        .collect(Collectors.toList()),
                posts.getTotalElements(),
                posts.getTotalPages(),
                posts.getNumber(),
                posts.getSize()
        );
        
        return ResponseEntity.ok(response);
    }
}

