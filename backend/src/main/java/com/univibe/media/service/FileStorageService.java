package com.univibe.media.service;

import com.univibe.media.model.FileScope;
import com.univibe.media.model.StoredFile;
import com.univibe.media.repo.StoredFileRepository;
import com.univibe.user.model.User;
import org.apache.tika.Tika;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@Service
public class FileStorageService {

    private static final long MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB
    private static final long MAX_PREVIEW_SIZE_BYTES = 512 * 1024; // 512 KB

    private final StoredFileRepository storedFileRepository;
    private final Tika tika = new Tika();

    public FileStorageService(StoredFileRepository storedFileRepository) {
        this.storedFileRepository = storedFileRepository;
    }

    public StoredFile store(MultipartFile file, User uploader, FileScope scope, Long scopeId, boolean markAsSticker) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("El archivo está vacío");
        }
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new IllegalArgumentException("El archivo supera el límite permitido de 15MB");
        }

        String detectedType = tika.detect(file.getInputStream(), file.getOriginalFilename());

        StoredFile storedFile = new StoredFile();
        storedFile.setUploader(uploader);
        storedFile.setFileName(file.getOriginalFilename());
        storedFile.setContentType(detectedType != null ? detectedType : file.getContentType());
        storedFile.setSizeInBytes(file.getSize());
        storedFile.setScope(scope);
        storedFile.setScopeId(scopeId);
        storedFile.setSticker(markAsSticker);
        storedFile.setData(file.getBytes());

        if (storedFile.getContentType() != null && storedFile.getContentType().startsWith("image/")) {
            if (file.getSize() <= MAX_PREVIEW_SIZE_BYTES) {
                storedFile.setPreviewBase64(Base64.getEncoder().encodeToString(storedFile.getData()));
            } else {
                byte[] truncated = file.getBytes();
                byte[] previewSlice = new byte[(int) Math.min(MAX_PREVIEW_SIZE_BYTES, truncated.length)];
                System.arraycopy(truncated, 0, previewSlice, 0, previewSlice.length);
                storedFile.setPreviewBase64(Base64.getEncoder().encodeToString(previewSlice));
            }
        }

        return storedFileRepository.save(storedFile);
    }

    public StoredFile findById(Long id) {
        return storedFileRepository.findById(id).orElse(null);
    }

    public void delete(Long id) {
        storedFileRepository.deleteById(id);
    }
}
















