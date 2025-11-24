package com.univibe.sticker.service;

import com.univibe.media.model.FileScope;
import com.univibe.media.model.StoredFile;
import com.univibe.media.service.FileStorageService;
import com.univibe.sticker.dto.StickerResponse;
import com.univibe.sticker.model.Sticker;
import com.univibe.sticker.repo.StickerRepository;
import com.univibe.user.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class StickerService {

    private final StickerRepository stickerRepository;
    private final FileStorageService fileStorageService;

    public StickerService(StickerRepository stickerRepository, FileStorageService fileStorageService) {
        this.stickerRepository = stickerRepository;
        this.fileStorageService = fileStorageService;
    }

    public StickerResponse createSticker(MultipartFile file, User owner, String nombre) throws IOException {
        if (!file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Solo se permiten imágenes para los stickers");
        }

        StoredFile storedFile = fileStorageService.store(file, owner, FileScope.STICKER, null, true);
        Sticker sticker = new Sticker();
        sticker.setFile(storedFile);
        sticker.setOwner(owner);
        sticker.setNombre(nombre);
        Sticker saved = stickerRepository.save(sticker);
        return toResponse(saved, owner);
    }

    @Transactional(readOnly = true)
    public List<StickerResponse> getStickers(User user) {
        try {
            List<Sticker> available = stickerRepository.findByOwnerIsNullOrOwner(user);
            List<Sticker> global = stickerRepository.findByGlobalFlagTrue();
            
            if ((available == null || available.isEmpty()) && (global == null || global.isEmpty())) {
                return new java.util.ArrayList<>();
            }
            
            // Collect all stickers first
            java.util.List<Sticker> allStickers = java.util.stream.Stream.concat(
                    available != null ? available.stream() : java.util.stream.Stream.empty(),
                    global != null ? global.stream() : java.util.stream.Stream.empty()
            )
            .distinct()
            .filter(sticker -> sticker != null && sticker.getFile() != null)
            .collect(Collectors.toList());
            
            // Force loading of LOBs within transaction by accessing them
            for (Sticker sticker : allStickers) {
                StoredFile file = sticker.getFile();
                if (file != null) {
                    // Force loading of LOB fields within transaction
                    String preview = file.getPreviewBase64();
                    byte[] data = file.getData();
                    // Access to ensure LOBs are loaded
                    if (preview == null) {
                        preview = "";
                    }
                }
            }
            
            return allStickers.stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .map(sticker -> toResponse(sticker, user))
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error al obtener stickers: " + e.getMessage(), e);
        }
    }

    public void deleteSticker(Long id, User requester) {
        Sticker sticker = stickerRepository.findById(id).orElseThrow();
        if (sticker.getOwner() == null || !sticker.getOwner().getId().equals(requester.getId())) {
            throw new IllegalArgumentException("No puedes eliminar este sticker");
        }
        stickerRepository.delete(sticker);
    }

    public StickerResponse publishSticker(Long id, User viewer) {
        Sticker sticker = stickerRepository.findById(id).orElseThrow();
        sticker.setGlobalFlag(true);
        Sticker saved = stickerRepository.save(sticker);
        return toResponse(saved, viewer);
    }

    @Transactional(readOnly = true)
    public Sticker findById(Long id) {
        return stickerRepository.findById(id).orElse(null);
    }

    private StickerResponse toResponse(Sticker sticker, User viewer) {
        StoredFile file = sticker.getFile();
        if (file == null) {
            throw new IllegalStateException("Sticker file is missing for sticker ID: " + sticker.getId());
        }
        boolean owned = sticker.getOwner() != null && viewer != null && sticker.getOwner().getId().equals(viewer.getId());
        return new StickerResponse(
                sticker.getId(),
                sticker.getNombre(),
                sticker.isGlobalFlag(),
                owned,
                file.getContentType(),
                file.getPreviewBase64() != null ? file.getPreviewBase64() : "",
                file.getId()
        );
    }
}

