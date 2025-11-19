package com.univibe.common.dto;

import java.util.Collections;
import java.util.List;

import org.springframework.data.domain.Page;

public record PageResponse<T>(List<T> content, long totalElements, int totalPages, int page, int size) {
    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getTotalElements(),
                page.getTotalPages(),
                page.getNumber(),
                page.getSize()
        );
    }

    public static <T> PageResponse<T> fromList(List<T> items, int page, int size) {
        if (size <= 0) {
            size = 10;
        }
        int totalElements = items.size();
        int fromIndex = Math.min(page * size, totalElements);
        int toIndex = Math.min(fromIndex + size, totalElements);
        List<T> slice = fromIndex >= totalElements ? Collections.emptyList() : items.subList(fromIndex, toIndex);
        int totalPages = (int) Math.ceil(totalElements / (double) size);
        return new PageResponse<>(
                slice,
                totalElements,
                Math.max(totalPages, 1),
                page,
                size
        );
    }
}
