package com.univibe.sticker.web;

import com.univibe.sticker.dto.StickerResponse;
import com.univibe.sticker.service.StickerService;
import com.univibe.user.model.Role;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/stickers")
public class StickerController {

    private final StickerService stickerService;
    private final UserRepository userRepository;

    public StickerController(StickerService stickerService, UserRepository userRepository) {
        this.stickerService = stickerService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<StickerResponse> list(Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        return stickerService.getStickers(user);
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public StickerResponse create(@RequestParam("file") MultipartFile file,
                                  @RequestParam(value = "nombre", required = false) String nombre,
                                  Authentication authentication) throws IOException {
        String email = (String) authentication.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        return stickerService.createSticker(file, user, nombre);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id, Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        stickerService.deleteSticker(id, user);
    }

    @PostMapping("/{id}/publish")
    public StickerResponse publish(@PathVariable Long id, Authentication authentication) {
        String email = (String) authentication.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        if (user.getRole() != Role.ADMIN && user.getRole() != Role.SERVER) {
            throw new AccessDeniedException("Solo administradores pueden publicar stickers globales");
        }
        return stickerService.publishSticker(id, user);
    }
}

