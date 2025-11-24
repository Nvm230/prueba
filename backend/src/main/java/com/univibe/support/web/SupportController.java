package com.univibe.support.web;

import com.univibe.support.dto.*;
import com.univibe.support.model.SupportTicketStatus;
import com.univibe.support.service.SupportService;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/support")
public class SupportController {

    private final SupportService supportService;
    private final UserRepository userRepository;

    public SupportController(SupportService supportService, UserRepository userRepository) {
        this.supportService = supportService;
        this.userRepository = userRepository;
    }

    @PostMapping("/tickets")
    public SupportTicketResponse crearTicket(@RequestBody SupportTicketRequest request, Authentication auth) {
        User requester = resolveUser(auth);
        return supportService.crearTicket(request, requester);
    }

    @GetMapping("/tickets/my")
    public List<SupportTicketResponse> misTickets(Authentication auth) {
        User requester = resolveUser(auth);
        return supportService.misTickets(requester);
    }

    @GetMapping("/tickets")
    @PreAuthorize("hasRole('ADMIN')")
    public List<SupportTicketResponse> todosLosTickets() {
        return supportService.todosLosTickets();
    }

    @GetMapping("/tickets/{ticketId}")
    public SupportTicketResponse obtenerTicket(@PathVariable Long ticketId, Authentication auth) {
        User requester = resolveUser(auth);
        return supportService.obtenerTicket(ticketId, requester);
    }

    @PostMapping("/tickets/{ticketId}/reply")
    @PreAuthorize("hasRole('ADMIN')")
    public SupportMessageResponse responder(@PathVariable Long ticketId,
                                            @RequestBody SupportReplyRequest request,
                                            Authentication auth) {
        User sender = resolveUser(auth);
        return supportService.responder(ticketId, sender, request.mensaje());
    }

    @PostMapping("/tickets/{ticketId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public SupportTicketResponse actualizarEstado(@PathVariable Long ticketId,
                                                  @RequestBody SupportStatusUpdateRequest request) {
        return supportService.actualizarEstado(ticketId, request.estado());
    }

    private User resolveUser(Authentication auth) {
        String email = (String) auth.getPrincipal();
        return userRepository.findByEmail(email).orElseThrow();
    }

}

