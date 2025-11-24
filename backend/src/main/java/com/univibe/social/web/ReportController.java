package com.univibe.social.web;

import com.univibe.common.dto.PageResponse;
import com.univibe.common.exception.NotFoundException;
import com.univibe.social.model.Report;
import com.univibe.social.repo.ReportRepository;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public ReportController(ReportRepository reportRepository, UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
    }

    private User resolveUser(Authentication auth) {
        if (auth == null || auth.getName() == null) {
            throw new NotFoundException("Usuario no autenticado");
        }
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new NotFoundException("Usuario no encontrado"));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createReport(
            @RequestBody Map<String, Object> request,
            Authentication auth) {
        User user = resolveUser(auth);
        
        Report report = new Report();
        report.setType(Report.ReportType.valueOf((String) request.get("type")));
        report.setTargetId(Long.valueOf(request.get("targetId").toString()));
        report.setReportedBy(user);
        report.setReason((String) request.get("reason"));
        report.setDetails((String) request.get("details"));
        report.setStatus(Report.ReportStatus.PENDING);
        report.setCreatedAt(Instant.now());
        
        report = reportRepository.save(report);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", report.getId());
        response.put("type", report.getType().name());
        response.put("targetId", report.getTargetId());
        response.put("reason", report.getReason());
        response.put("details", report.getDetails());
        response.put("status", report.getStatus().name());
        response.put("createdAt", report.getCreatedAt().toString());
        response.put("reportedBy", Map.of(
                "id", report.getReportedBy().getId(),
                "name", report.getReportedBy().getName(),
                "email", report.getReportedBy().getEmail()
        ));
        
        return ResponseEntity.ok(response);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PageResponse<Map<String, Object>>> getReports(
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20) Pageable pageable,
            Authentication auth) {
        Page<Report> reports;
        
        if (status != null && !status.isEmpty()) {
            reports = reportRepository.findByStatusOrderByCreatedAtDesc(
                    Report.ReportStatus.valueOf(status.toUpperCase()), pageable);
        } else {
            reports = reportRepository.findAllByOrderByCreatedAtDesc(pageable);
        }
        
        PageResponse<Map<String, Object>> response = new PageResponse<>(
                reports.getContent().stream()
                        .map(r -> {
                            Map<String, Object> reportMap = new HashMap<>();
                            reportMap.put("id", r.getId());
                            reportMap.put("type", r.getType().name());
                            reportMap.put("targetId", r.getTargetId());
                            reportMap.put("reason", r.getReason());
                            reportMap.put("details", r.getDetails());
                            reportMap.put("status", r.getStatus().name());
                            reportMap.put("createdAt", r.getCreatedAt().toString());
                            reportMap.put("reviewedAt", r.getReviewedAt() != null ? r.getReviewedAt().toString() : null);
                            reportMap.put("reportedBy", Map.of(
                                    "id", r.getReportedBy().getId(),
                                    "name", r.getReportedBy().getName(),
                                    "email", r.getReportedBy().getEmail()
                            ));
                            if (r.getReviewedBy() != null) {
                                reportMap.put("reviewedBy", Map.of(
                                        "id", r.getReviewedBy().getId(),
                                        "name", r.getReviewedBy().getName()
                                ));
                            }
                            return reportMap;
                        })
                        .collect(Collectors.toList()),
                reports.getTotalElements(),
                reports.getTotalPages(),
                reports.getNumber(),
                reports.getSize()
        );
        
        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{reportId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateReportStatus(
            @PathVariable Long reportId,
            @RequestBody Map<String, String> request,
            Authentication auth) {
        User user = resolveUser(auth);
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new NotFoundException("Reporte no encontrado"));
        
        report.setStatus(Report.ReportStatus.valueOf(request.get("status")));
        report.setReviewedAt(Instant.now());
        report.setReviewedBy(user);
        
        report = reportRepository.save(report);
        
        Map<String, Object> response = new HashMap<>();
        response.put("id", report.getId());
        response.put("status", report.getStatus().name());
        response.put("reviewedAt", report.getReviewedAt().toString());
        response.put("reviewedBy", Map.of(
                "id", report.getReviewedBy().getId(),
                "name", report.getReviewedBy().getName()
        ));
        
        return ResponseEntity.ok(response);
    }
}

