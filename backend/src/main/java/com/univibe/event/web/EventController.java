package com.univibe.event.web;

import com.univibe.common.dto.PageResponse;
import com.univibe.call.model.CallContextType;
import com.univibe.call.service.CallService;
import com.univibe.event.dto.*;
import com.univibe.event.model.Event;
import com.univibe.event.model.EventStatus;
import com.univibe.event.model.EventVisibility;
import com.univibe.event.repo.EventRepository;
import com.univibe.event.service.EventSecurityService;
import com.univibe.group.repo.GroupSurveyRepository;
import com.univibe.registration.model.RegistrationStatus;
import com.univibe.registration.repo.RegistrationRepository;
import com.univibe.registration.service.QrService;
import com.univibe.survey.model.Survey;
import com.univibe.survey.repo.SurveyRepository;
import com.univibe.user.model.Role;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.hibernate.proxy.HibernateProxy;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.hibernate.Hibernate;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;
    private final SurveyRepository surveyRepository;
    private final GroupSurveyRepository groupSurveyRepository;
    private final QrService qrService;
    private final EventSecurityService eventSecurityService;
    private final CallService callService;

    public EventController(EventRepository eventRepository,
                           UserRepository userRepository,
                           RegistrationRepository registrationRepository,
                           SurveyRepository surveyRepository,
                           GroupSurveyRepository groupSurveyRepository,
                           QrService qrService,
                           EventSecurityService eventSecurityService,
                           CallService callService) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.registrationRepository = registrationRepository;
        this.surveyRepository = surveyRepository;
        this.groupSurveyRepository = groupSurveyRepository;
        this.qrService = qrService;
        this.eventSecurityService = eventSecurityService;
        this.callService = callService;
    }

    private EventResponseDTO toDto(Event event) {
        EventResponseDTO dto = new EventResponseDTO(event);
        dto.setGroupRestricted(eventSecurityService.isGroupRestricted(event));
        return dto;
    }

    private User resolveUser(Authentication auth) {
        if (auth == null) {
            return null;
        }
        String email = (String) auth.getPrincipal();
        return userRepository.findByEmail(email).orElse(null);
    }

    private boolean isAdminOrServer(User user) {
        if (user == null) {
            return false;
        }
        return user.getRole() == Role.ADMIN || user.getRole() == Role.SERVER;
    }

    private void validateEventSchedule(Instant startTime, Instant endTime) {
        if (startTime == null || endTime == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Debes indicar fecha y hora de inicio y fin");
        }
        Instant now = Instant.now();
        if (!startTime.isAfter(now.plusSeconds(300))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha y hora de inicio deben ser al menos 5 minutos posteriores al momento actual");
        }
        if (!endTime.isAfter(startTime)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha y hora de finalización deben ser posteriores al inicio");
        }
    }

    @GetMapping(params = "!registered")
    @Transactional(readOnly = true)
    public PageResponse<EventResponseDTO> list(
            @RequestParam Optional<EventStatus> status,
            @RequestParam Optional<String> category,
            @RequestParam Optional<String> search,
            @RequestParam Optional<EventVisibility> visibility,
            @PageableDefault(size = 12, sort = "startTime", direction = Sort.Direction.ASC) Pageable pageable,
            Authentication auth
    ) {

        Specification<Event> spec = Specification.where(null);
        User currentUser = resolveUser(auth);
        boolean isAdmin = isAdminOrServer(currentUser);

        if (visibility.isPresent()) {
            EventVisibility requested = visibility.get();
            if (requested == EventVisibility.PRIVATE && !isAdmin) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solo administradores pueden listar eventos privados");
            }
            spec = spec.and((root, query, cb) -> cb.equal(root.get("visibility"), requested));
        } else if (!isAdmin) {
            spec = spec.and((root, query, cb) -> {
                var isPublic = cb.equal(root.get("visibility"), EventVisibility.PUBLIC);
                if (currentUser != null) {
                    var createdBy = root.get("createdBy");
                    var isCreator = cb.equal(createdBy.get("id"), currentUser.getId());
                    return cb.or(isPublic, isCreator);
                }
                return isPublic;
            });
        }

        // Filter by status
        if (status.isPresent()) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("status"), status.get()));
        }

        // Filter by category
        if (category.isPresent() && StringUtils.hasText(category.get())) {
            String value = category.get().toLowerCase();
            spec = spec.and((root, query, cb) ->
                    cb.equal(cb.lower(root.get("category")), value));
        }

        // Filter by search text (title)
        if (search.isPresent() && StringUtils.hasText(search.get())) {
            String value = search.get().toLowerCase();
            spec = spec.and((root, query, cb) ->
                    cb.like(cb.lower(root.get("title")), "%" + value + "%"));
        }

        // Cargar eventos con createdBy usando @EntityGraph
        Page<Event> page = eventRepository.findAll(spec, pageable);
        
        // Inicializar proxies antes de crear DTOs
        page.getContent().forEach(event -> {
            if (event.getCreatedBy() != null) {
                try {
                    Hibernate.initialize(event.getCreatedBy());
                    if (event.getCreatedBy() instanceof HibernateProxy) {
                        HibernateProxy proxy = (HibernateProxy) event.getCreatedBy();
                        if (!proxy.getHibernateLazyInitializer().isUninitialized()) {
                            User createdBy = (User) proxy.getHibernateLazyInitializer().getImplementation();
                            event.setCreatedBy(createdBy);
                        }
                    }
                } catch (Exception e) {
                    // Si falla, establecer a null
                    event.setCreatedBy(null);
                }
            }
        });
        
        // Convertir Event a EventResponseDTO para evitar problemas con proxies
        List<EventResponseDTO> dtoList = page.getContent().stream()
            .map(this::toDto)
            .collect(Collectors.toList());
        
        // Crear un PageResponse con los DTOs
        return new PageResponse<>(
            dtoList,
            page.getTotalElements(),
            page.getTotalPages(),
            page.getNumber(),
            page.getSize()
        );
    }

    @GetMapping("/registered")
    @Transactional(readOnly = true)
    public PageResponse<EventResponseDTO> listRegistered(Authentication auth) {
        if (auth == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Debe iniciar sesión para ver sus inscripciones");
        }
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();

        List<com.univibe.registration.model.Registration> registrations = registrationRepository.findByUserId(user.getId());
        List<EventResponseDTO> events = registrations.stream()
                .map(com.univibe.registration.model.Registration::getEvent)
                .map(this::toDto)
                .collect(Collectors.toList());

        return new PageResponse<>(
                events,
                events.size(),
                1,
                0,
                events.size()
        );
    }

    @GetMapping(params = "registered")
    @Transactional(readOnly = true)
    public PageResponse<EventResponseDTO> listRegisteredWithParam(Authentication auth) {
        return listRegistered(auth);
    }


    @GetMapping("/{eventId}")
    @Transactional(readOnly = true)
    public EventResponseDTO getById(@PathVariable Long eventId, Authentication auth) {
        // Cargar evento con createdBy usando @EntityGraph
        Event event = eventRepository.findById(eventId).orElseThrow();
        // Inicializar proxy antes de crear DTO
        if (event.getCreatedBy() != null) {
            try {
                Hibernate.initialize(event.getCreatedBy());
                if (event.getCreatedBy() instanceof HibernateProxy) {
                    HibernateProxy proxy = (HibernateProxy) event.getCreatedBy();
                    if (!proxy.getHibernateLazyInitializer().isUninitialized()) {
                        User createdBy = (User) proxy.getHibernateLazyInitializer().getImplementation();
                        event.setCreatedBy(createdBy);
                    }
                }
            } catch (Exception e) {
                event.setCreatedBy(null);
            }
        }
        User requester = resolveUser(auth);
        if (!eventSecurityService.canAccessEvent(event, requester)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Este evento es privado. Únete al grupo correspondiente para acceder.");
        }

        // Convertir a DTO para evitar problemas con proxies
        return toDto(event);
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public ResponseEntity<?> create(@RequestBody @Valid EventCreateRequest req, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User creator = userRepository.findByEmail(email).orElseThrow();

        validateEventSchedule(req.getStartTime(), req.getEndTime());

        // Validar que no exista un evento con el mismo título y hora de inicio
        Optional<Event> existingEvent = eventRepository.findByTitleIgnoreCaseAndStartTime(req.getTitle(), req.getStartTime());

        if (existingEvent.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "Ya existe un evento con el mismo título y hora de inicio"));
        }

        Event event = new Event();
        event.setTitle(req.getTitle());
        event.setCategory(req.getCategory());
        event.setDescription(req.getDescription());
        event.setFaculty(req.getFaculty() != null && !req.getFaculty().trim().isEmpty() ? req.getFaculty() : null);
        event.setCareer(req.getCareer() != null && !req.getCareer().trim().isEmpty() ? req.getCareer() : null);
        event.setStartTime(req.getStartTime());
        event.setEndTime(req.getEndTime());
        if (req.getVisibility() != null) {
            event.setVisibility(req.getVisibility());
        }
        event.setCreatedBy(creator);
        event.setCheckInPassword(eventSecurityService.generateCheckInPassword());
        event.setVisibility(req.getVisibility() != null ? req.getVisibility() : EventVisibility.PUBLIC);
        event.setMaxCapacity(req.getMaxCapacity());
        
        Event savedEvent = eventRepository.save(event);
        return ResponseEntity.ok(toDto(savedEvent));
    }

    @PostMapping("/{eventId}/start")
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public EventResponseDTO start(@PathVariable Long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        callService.endSessionsForContext(CallContextType.EVENT, eventId.longValue());
        event.setStatus(EventStatus.LIVE);
        Event savedEvent = eventRepository.save(event);
        return toDto(savedEvent);
    }

    @PostMapping("/{eventId}/finish")
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public EventResponseDTO finish(@PathVariable Long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        callService.endSessionsForContext(CallContextType.EVENT, eventId.longValue());
        event.setStatus(EventStatus.FINISHED);
        Event savedEvent = eventRepository.save(event);
        return toDto(savedEvent);
    }

    @PutMapping("/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public ResponseEntity<?> update(@PathVariable Long eventId, @RequestBody @Valid EventUpdateRequest req, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        Event event = eventRepository.findById(eventId).orElseThrow();

        // Solo el creador o admin puede modificar
        if (event.getCreatedBy() == null || (!event.getCreatedBy().getId().equals(user.getId()) && user.getRole() != Role.ADMIN)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Solo el creador del evento o un administrador pueden modificarlo"));
        }

        if (event.getStatus() != EventStatus.PENDING) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "Solo puedes modificar eventos que aún no han iniciado"));
        }

        validateEventSchedule(req.getStartTime(), req.getEndTime());

        // Validar duplicados (excluyendo el evento actual)
        Optional<Event> existingEvent = eventRepository.findByTitleIgnoreCaseAndStartTime(req.getTitle(), req.getStartTime());

        if (existingEvent.isPresent() && !existingEvent.get().getId().equals(eventId)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("error", "Ya existe otro evento con el mismo título y hora de inicio"));
        }

        event.setTitle(req.getTitle());
        event.setCategory(req.getCategory());
        event.setDescription(req.getDescription());
        event.setFaculty(req.getFaculty() != null && !req.getFaculty().trim().isEmpty() ? req.getFaculty() : null);
        event.setCareer(req.getCareer() != null && !req.getCareer().trim().isEmpty() ? req.getCareer() : null);
        event.setStartTime(req.getStartTime());
        event.setEndTime(req.getEndTime());
        event.setMaxCapacity(req.getMaxCapacity());
        
        Event updatedEvent = eventRepository.save(event);
        return ResponseEntity.ok(toDto(updatedEvent));
    }

    @DeleteMapping("/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Transactional
    public ResponseEntity<?> delete(@PathVariable Long eventId) {
        Event event = eventRepository.findById(eventId).orElseThrow();

        if (event.getStatus() != EventStatus.PENDING) {
            if (event.getStatus() == EventStatus.LIVE) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "No puedes eliminar un evento que está en vivo. Finalízalo o cancélalo antes de eliminarlo."));
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "No se puede eliminar este evento porque ya finalizó."));
        }

        List<Survey> surveys = surveyRepository.findByEventId(eventId);
        if (!surveys.isEmpty()) {
            List<Long> surveyIds = surveys.stream().map(Survey::getId).toList();
            groupSurveyRepository.deleteBySurveyIdIn(surveyIds);
            surveyRepository.deleteAll(surveys);
            surveyRepository.flush();
        }

        registrationRepository.deleteByEventId(eventId);
        eventRepository.delete(event);
        return ResponseEntity.ok(Map.of("message", "Evento eliminado exitosamente"));
    }

    @GetMapping("/{eventId}/registrations")
    public ResponseEntity<?> getRegistrations(@PathVariable Long eventId, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        Event event = eventRepository.findById(eventId).orElseThrow();

        boolean isAdminOrServer = user.getRole() == Role.ADMIN || user.getRole() == Role.SERVER;
        boolean isCreator = event.getCreatedBy() != null && event.getCreatedBy().getId().equals(user.getId());

        if (isAdminOrServer || isCreator) {
            // Mostrar nombres y correos para admin/server/creador
            List<RegisteredUserResponse> registrations = registrationRepository.findByEventId(eventId).stream()
                .map(r -> new RegisteredUserResponse(
                    r.getUser().getId(),
                    r.getUser().getName(),
                    r.getUser().getEmail(),
                    r.getStatus().toString(),
                    r.getCheckedInAt()
                ))
                .collect(Collectors.toList());
            return ResponseEntity.ok(registrations);
        } else {
            // Solo mostrar cantidad para usuarios normales
            long count = registrationRepository.findByEventId(eventId).size();
            return ResponseEntity.ok(Map.of("count", count));
        }
    }

    @GetMapping("/{eventId}/stats")
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public ResponseEntity<?> getStats(@PathVariable Long eventId, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        Event event = eventRepository.findById(eventId).orElseThrow();

        // Solo el creador o admin puede ver estadísticas
        boolean isAdmin = user.getRole() == Role.ADMIN;
        boolean isCreator = event.getCreatedBy() != null && event.getCreatedBy().getId().equals(user.getId());

        if (!isAdmin && !isCreator) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Solo el creador del evento o un administrador pueden ver las estadísticas"));
        }

        long totalRegistrations = registrationRepository.findByEventId(eventId).size();
        long checkedInCount = registrationRepository.countByEventIdAndStatus(eventId, RegistrationStatus.CHECKED_IN);
        long pendingCheckInCount = registrationRepository.countByEventIdAndStatus(eventId, RegistrationStatus.REGISTERED);
        
        java.time.Instant lastCheckInAt = registrationRepository.findByEventId(eventId).stream()
            .filter(r -> r.getCheckedInAt() != null)
            .map(r -> r.getCheckedInAt())
            .max(java.time.Instant::compareTo)
            .orElse(null);

        EventStatsResponse stats = new EventStatsResponse(totalRegistrations, checkedInCount, pendingCheckInCount, lastCheckInAt);
        return ResponseEntity.ok(stats);
    }

    @GetMapping(value = "/{eventId}/registration-qr", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getEventRegistrationQr(@PathVariable Long eventId, Authentication auth) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        User user = resolveUser(auth);
        if (!eventSecurityService.canAccessEvent(event, user)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Este evento es privado. Solo los miembros autorizados pueden ver el QR de registro."));
        }
        
        // No permitir registro a eventos finalizados
        if (event.getStatus() == EventStatus.FINISHED) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "No se puede registrar a eventos finalizados"));
        }
        
        String payload = qrService.generateEventRegistrationPayload(eventId);
        String qrBase64 = qrService.generateBase64Png(payload);
        
        return ResponseEntity.ok(Map.of(
            "eventId", eventId,
            "qrBase64", qrBase64,
            "payload", payload
        ));
    }

    @GetMapping("/{eventId}/check-in-password")
    public ResponseEntity<?> getCheckInPassword(@PathVariable Long eventId, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        Event event = eventRepository.findById(eventId).orElseThrow();

        // Solo el creador o admin puede ver la contraseña
        boolean isAdmin = user.getRole() == Role.ADMIN;
        boolean isCreator = event.getCreatedBy() != null && event.getCreatedBy().getId().equals(user.getId());

        if (!isAdmin && !isCreator) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error", "Solo el creador del evento o un administrador pueden ver la contraseña de check-in"));
        }

        String password = event.getCheckInPassword();
        String qrBase64 = qrService.generateBase64Png(password);
        
        CheckInPasswordResponse response = new CheckInPasswordResponse(password, qrBase64);
        return ResponseEntity.ok(response);
    }
}
