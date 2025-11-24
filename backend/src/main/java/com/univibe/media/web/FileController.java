package com.univibe.media.web;

import com.univibe.event.model.Event;
import com.univibe.event.repo.EventRepository;
import com.univibe.event.service.EventSecurityService;
import com.univibe.group.model.Group;
import com.univibe.group.repo.GroupRepository;
import com.univibe.media.dto.FileUploadResponse;
import com.univibe.media.model.FileScope;
import com.univibe.media.model.StoredFile;
import com.univibe.media.service.FileStorageService;
import com.univibe.user.model.Role;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService fileStorageService;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final EventSecurityService eventSecurityService;
    private final GroupRepository groupRepository;

    public FileController(FileStorageService fileStorageService,
                          UserRepository userRepository,
                          EventRepository eventRepository,
                          EventSecurityService eventSecurityService,
                          GroupRepository groupRepository) {
        this.fileStorageService = fileStorageService;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.eventSecurityService = eventSecurityService;
        this.groupRepository = groupRepository;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public FileUploadResponse uploadFile(@RequestParam("file") MultipartFile file,
                                         @RequestParam("scope") FileScope scope,
                                         @RequestParam(value = "scopeId", required = false) Long scopeId,
                                         Authentication authentication) throws IOException {
        if (authentication == null) {
            throw new AccessDeniedException("No autenticado");
        }
        String email = (String) authentication.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();

        StoredFile stored = fileStorageService.store(file, user, scope, scopeId, scope == FileScope.STICKER);
        return new FileUploadResponse(
                stored.getId(),
                stored.getFileName(),
                stored.getContentType(),
                stored.getSizeInBytes(),
                stored.getPreviewBase64()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> download(@PathVariable Long id, Authentication authentication) {
        StoredFile storedFile = fileStorageService.findById(id);
        if (storedFile == null) {
            return ResponseEntity.notFound().build();
        }

        // Verificar permisos
        boolean canAccess = false;
        
        if (authentication != null) {
            // Con autenticación, usar la lógica normal de permisos
            String email = (String) authentication.getPrincipal();
            User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                canAccess = canAccess(storedFile, user);
            }
        } else {
            // Sin autenticación, solo permitir archivos públicos (OTHER, STICKER, SUPPORT)
            FileScope scope = storedFile.getScope();
            canAccess = (scope == FileScope.OTHER || scope == FileScope.STICKER || scope == FileScope.SUPPORT);
        }
        
        if (!canAccess) {
            throw new AccessDeniedException("No puedes acceder a este archivo");
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(storedFile.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + storedFile.getFileName() + "\"")
                .body(storedFile.getData());
    }

    private boolean canAccess(StoredFile storedFile, User user) {
        if (user.getRole() == Role.ADMIN || user.getRole() == Role.SERVER) {
            return true;
        }
        if (storedFile.getUploader() != null && storedFile.getUploader().getId().equals(user.getId())) {
            return true;
        }
        FileScope scope = storedFile.getScope();
        if (scope == null) {
            return false;
        }
        return switch (scope) {
            case EVENT_CHAT -> canAccessEventFile(storedFile, user);
            case GROUP_CHAT -> canAccessGroupFile(storedFile, user);
            case PRIVATE_CHAT -> storedFile.getScopeId() != null && storedFile.getScopeId().equals(user.getId());
            case SUPPORT, STICKER, OTHER -> true;
        };
    }

    private boolean canAccessEventFile(StoredFile storedFile, User user) {
        if (storedFile.getScopeId() == null) {
            return false;
        }
        Event event = eventRepository.findById(storedFile.getScopeId()).orElse(null);
        if (event == null) {
            return false;
        }
        return eventSecurityService.canAccessEvent(event, user);
    }

    private boolean canAccessGroupFile(StoredFile storedFile, User user) {
        if (storedFile.getScopeId() == null) {
            return false;
        }
        Group group = groupRepository.findById(storedFile.getScopeId()).orElse(null);
        if (group == null) {
            return false;
        }
        return group.getMembers().stream().anyMatch(member -> member.getId().equals(user.getId()));
    }
}
















