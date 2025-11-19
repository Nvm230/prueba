package com.univibe.support.service;

import com.univibe.support.dto.*;
import com.univibe.support.model.SupportMessage;
import com.univibe.support.model.SupportTicket;
import com.univibe.support.model.SupportTicketStatus;
import com.univibe.support.repo.SupportMessageRepository;
import com.univibe.support.repo.SupportTicketRepository;
import com.univibe.user.model.User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SupportService {

    private final SupportTicketRepository ticketRepository;
    private final SupportMessageRepository messageRepository;

    public SupportService(SupportTicketRepository ticketRepository, SupportMessageRepository messageRepository) {
        this.ticketRepository = ticketRepository;
        this.messageRepository = messageRepository;
    }

    @Transactional
    public SupportTicketResponse crearTicket(SupportTicketRequest request, User requester) {
        SupportTicket ticket = new SupportTicket();
        ticket.setRequester(requester);
        ticket.setAsunto(request.asunto());
        ticket.setCategoria(request.categoria());
        ticket.setEstado(SupportTicketStatus.OPEN);
        SupportTicket saved = ticketRepository.save(ticket);

        SupportMessage primerMensaje = new SupportMessage();
        primerMensaje.setTicket(saved);
        primerMensaje.setSender(requester);
        primerMensaje.setContenido(request.mensaje());
        messageRepository.save(primerMensaje);
        saved.getMensajes().add(primerMensaje);

        return toResponse(saved, true);
    }

    @Transactional(readOnly = true)
    public List<SupportTicketResponse> misTickets(User requester) {
        List<SupportTicket> tickets = ticketRepository.findByRequesterOrderByUpdatedAtDesc(requester);
        // Cargar mensajes para cada ticket
        return tickets.stream()
                .map(ticket -> {
                    // Forzar carga de mensajes y senders dentro de la transacción
                    if (ticket.getMensajes() != null) {
                        ticket.getMensajes().forEach(msg -> {
                            if (msg.getSender() != null) {
                                msg.getSender().getId();
                                msg.getSender().getName();
                            }
                        });
                    }
                    return toResponse(ticket, true); // Incluir mensajes
                })
                .toList();
    }

    public List<SupportTicketResponse> todosLosTickets() {
        return ticketRepository.findAllByOrderByUpdatedAtDesc().stream()
                .map(ticket -> toResponse(ticket, false))
                .toList();
    }

    @Transactional(readOnly = true)
    public SupportTicketResponse obtenerTicket(Long ticketId, User requester) {
        // Verificar permisos primero usando una consulta simple
        boolean isAdmin = requester.getRole() == com.univibe.user.model.Role.ADMIN 
                || requester.getRole() == com.univibe.user.model.Role.SERVER;
        
        if (!isAdmin) {
            // Verificar que el ticket pertenezca al usuario usando una consulta simple
            Long ticketRequesterId = ticketRepository.findRequesterIdById(ticketId)
                    .orElseThrow(() -> new IllegalArgumentException("Ticket no encontrado"));
            
            if (!ticketRequesterId.equals(requester.getId())) {
                throw new org.springframework.security.access.AccessDeniedException("Forbidden");
            }
        }
        
        // Cargar el ticket completo con mensajes usando JOIN FETCH
        SupportTicket ticket = ticketRepository.findByIdWithMessages(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket no encontrado"));
        
        // Forzar carga de mensajes y senders (por si acaso)
        if (ticket.getMensajes() != null) {
            ticket.getMensajes().forEach(msg -> {
                if (msg.getSender() != null) {
                    msg.getSender().getId();
                    msg.getSender().getName();
                }
            });
        }
        
        return toResponse(ticket, true);
    }

    @Transactional
    public SupportMessageResponse responder(Long ticketId, User sender, String mensaje) {
        SupportTicket ticket = ticketRepository.findById(ticketId).orElseThrow();
        if (ticket.getEstado() == SupportTicketStatus.CLOSED) {
            throw new IllegalStateException("No se pueden enviar mensajes a un ticket cerrado");
        }
        SupportMessage respuesta = new SupportMessage();
        respuesta.setTicket(ticket);
        respuesta.setSender(sender);
        respuesta.setContenido(mensaje);
        SupportMessage saved = messageRepository.save(respuesta);
        // Si estaba abierto, cambiar a en progreso
        if (ticket.getEstado() == SupportTicketStatus.OPEN) {
            ticket.setEstado(SupportTicketStatus.IN_PROGRESS);
            ticketRepository.save(ticket);
        }
        return toMessageResponse(saved);
    }

    @Transactional
    public SupportTicketResponse actualizarEstado(Long ticketId, SupportTicketStatus estado) {
        SupportTicket ticket = ticketRepository.findById(ticketId).orElseThrow();
        // No permitir cambiar de CLOSED a otro estado
        if (ticket.getEstado() == SupportTicketStatus.CLOSED && estado != SupportTicketStatus.CLOSED) {
            throw new IllegalStateException("No se puede cambiar el estado de un ticket cerrado");
        }
        ticket.setEstado(estado);
        SupportTicket saved = ticketRepository.save(ticket);
        return toResponse(saved, false);
    }

    private SupportTicketResponse toResponse(SupportTicket ticket, boolean includeMessages) {
        List<SupportMessageResponse> mensajes = List.of();
        if (includeMessages && ticket.getMensajes() != null) {
            try {
                int count = ticket.getMensajes().size();
                System.out.println("[SupportService] Loading " + count + " messages for ticket " + ticket.getId());
                mensajes = ticket.getMensajes().stream()
                        .map(msg -> {
                            System.out.println("[SupportService] Mapping message " + msg.getId() + " from sender " + (msg.getSender() != null ? msg.getSender().getId() : "null"));
                            return toMessageResponse(msg);
                        })
                        .toList();
                System.out.println("[SupportService] Mapped " + mensajes.size() + " messages");
            } catch (Exception e) {
                System.err.println("[SupportService] Error loading messages: " + e.getMessage());
                e.printStackTrace();
            }
        }
        SupportUserInfo solicitante = new SupportUserInfo(
                ticket.getRequester().getId(),
                ticket.getRequester().getName(),
                ticket.getRequester().getEmail(),
                ticket.getRequester().getProfilePictureUrl()
        );
        return new SupportTicketResponse(
                ticket.getId(),
                ticket.getAsunto(),
                ticket.getCategoria(),
                ticket.getEstado(),
                ticket.getCreatedAt(),
                ticket.getUpdatedAt(),
                solicitante,
                mensajes
        );
    }

    private SupportMessageResponse toMessageResponse(SupportMessage message) {
        SupportUserInfo senderInfo = new SupportUserInfo(
                message.getSender().getId(),
                message.getSender().getName(),
                message.getSender().getEmail(),
                message.getSender().getProfilePictureUrl()
        );
        return new SupportMessageResponse(
                message.getId(),
                senderInfo,
                message.getContenido(),
                message.getCreatedAt()
        );
    }
}

