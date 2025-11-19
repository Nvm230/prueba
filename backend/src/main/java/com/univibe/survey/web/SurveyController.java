package com.univibe.survey.web;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.univibe.common.dto.PageResponse;
import com.univibe.event.model.Event;
import com.univibe.event.repo.EventRepository;
import com.univibe.group.model.GroupSurvey;
import com.univibe.group.repo.GroupSurveyRepository;
import com.univibe.registration.repo.RegistrationRepository;
import com.univibe.survey.dto.SurveyResponseDTO;
import com.univibe.survey.model.Survey;
import com.univibe.survey.model.SurveyAnswer;
import com.univibe.survey.model.SurveyQuestion;
import com.univibe.survey.repo.SurveyAnswerRepository;
import com.univibe.survey.repo.SurveyRepository;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/surveys")
public class SurveyController {
    private final SurveyRepository surveyRepository;
    private final SurveyAnswerRepository answerRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final RegistrationRepository registrationRepository;
    private final GroupSurveyRepository groupSurveyRepository;

    public SurveyController(SurveyRepository surveyRepository, SurveyAnswerRepository answerRepository, EventRepository eventRepository, UserRepository userRepository, RegistrationRepository registrationRepository, GroupSurveyRepository groupSurveyRepository) {
        this.surveyRepository = surveyRepository;
        this.answerRepository = answerRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
        this.registrationRepository = registrationRepository;
        this.groupSurveyRepository = groupSurveyRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public PageResponse<SurveyResponseDTO> list(
            @RequestParam Optional<Long> eventId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        boolean isAdmin = user.getRole().name().equals("ADMIN") || user.getRole().name().equals("SERVER");
        List<Survey> surveys;
        
        if (eventId.isPresent()) {
            Long eId = eventId.get();
            var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id"));
            if (!isAdmin) {
                boolean isRegistered = registrationRepository.findByUserIdAndEventId(user.getId(), eId).isPresent();
                if (!isRegistered) {
                    return PageResponse.fromList(List.of(), page, size);
                }
            }
            var surveyPage = surveyRepository.findByEventId(eId, pageable).map(SurveyResponseDTO::new);
            return PageResponse.from(surveyPage);
        }
        
        // Sin eventId: solo admins pueden ver todas las encuestas
        if (isAdmin) {
            var surveyPage = surveyRepository.findAll(PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "id")))
                    .map(SurveyResponseDTO::new);
            return PageResponse.from(surveyPage);
        } else {
            // Usuarios normales: encuestas de eventos donde están registrados + encuestas de grupos donde son miembros
            List<Survey> allSurveys = surveyRepository.findAll();
            List<GroupSurvey> groupSurveys = groupSurveyRepository.findAll();
            surveys = allSurveys.stream()
                    .filter(s -> {
                        // Si tiene evento, verificar registro
                        if (s.getEvent() != null) {
                            return registrationRepository.findByUserIdAndEventId(user.getId(), s.getEvent().getId()).isPresent();
                        }
                        // Si no tiene evento, es encuesta de grupo - verificar si está compartida en algún grupo del usuario
                        return groupSurveys.stream()
                                .anyMatch(gs -> gs.getSurvey().getId().equals(s.getId()) 
                                        && (gs.getGroup().getOwner().getId().equals(user.getId()) 
                                            || gs.getGroup().getMembers().stream().anyMatch(m -> m.getId().equals(user.getId()))));
                    })
                    .toList();
        }
        surveys.sort((a, b) -> Long.compare(b.getId(), a.getId()));
        List<SurveyResponseDTO> dtoList = surveys.stream().map(SurveyResponseDTO::new).toList();
        return PageResponse.fromList(dtoList, page, size);
    }

    @GetMapping("/{surveyId}")
    @Transactional(readOnly = true)
    public SurveyResponseDTO get(@PathVariable Long surveyId, Authentication auth) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        boolean isAdmin = user.getRole().name().equals("ADMIN") || user.getRole().name().equals("SERVER");
        
        Survey survey = surveyRepository.findById(surveyId).orElseThrow();
        
        // Si no es admin, verificar que esté registrado al evento
        if (!isAdmin) {
            boolean isRegistered = registrationRepository.findByUserIdAndEventId(user.getId(), survey.getEvent().getId()).isPresent();
            if (!isRegistered) {
                throw new org.springframework.security.access.AccessDeniedException("Not registered to this event");
            }
        }
        
        return new SurveyResponseDTO(survey);
    }

    @GetMapping("/{surveyId}/answers")
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public List<SurveyAnswer> getAnswers(@PathVariable Long surveyId) {
        Survey survey = surveyRepository.findById(surveyId).orElseThrow();
        return survey.getQuestions().stream()
                .flatMap(q -> answerRepository.findByQuestionId(q.getId()).stream())
                .toList();
    }

    @PostMapping
    @Transactional
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    public Map<String, Object> create(@RequestParam Long eventId,
                                      @RequestParam String title,
                                      @RequestParam List<String> questions) {
        try {
            Survey s = new Survey();
            Event event = eventRepository.findById(eventId)
                    .orElseThrow(() -> new IllegalArgumentException("Event not found: " + eventId));
            
            // Validar que el evento esté en estado PENDING o LIVE
            if (event.getStatus() == com.univibe.event.model.EventStatus.FINISHED) {
                throw new IllegalArgumentException("Cannot create survey for finished events. Only PENDING or LIVE events are allowed.");
            }
            
            s.setEvent(event);
            s.setTitle(title);
            s.setClosed(false);
            
            if (questions == null || questions.isEmpty()) {
                throw new IllegalArgumentException("At least one question is required");
            }
            
            for (String q : questions) {
                if (q == null || q.trim().isEmpty() || q.trim().length() < 1) {
                    continue; // Skip empty questions
                }
                SurveyQuestion sq = new SurveyQuestion();
                sq.setSurvey(s);
                sq.setText(q.trim());
                s.getQuestions().add(sq);
            }
            
            if (s.getQuestions().isEmpty()) {
                throw new IllegalArgumentException("At least one non-empty question is required");
            }
            
            Survey saved = surveyRepository.save(s);
            
            Map<String, Object> result = new HashMap<>();
            result.put("surveyId", saved.getId());
            result.put("questionIds", saved.getQuestions().stream().map(SurveyQuestion::getId).toList());
            return result;
        } catch (Exception e) {
            e.printStackTrace(); // Log the full error
            throw new RuntimeException("Failed to create survey: " + e.getMessage(), e);
        }
    }

    @PostMapping("/{questionId}/answer")
    @Transactional
    public Map<String, Object> answer(@PathVariable Long questionId,
                                      Authentication auth,
                                      @RequestParam String answer) {
        String email = (String) auth.getPrincipal();
        User user = userRepository.findByEmail(email).orElseThrow();
        
        // Buscar la encuesta que contiene la pregunta
        Survey s = surveyRepository.findAll().stream()
            .filter(sv -> sv.getQuestions() != null && sv.getQuestions().stream().anyMatch(q -> q.getId() != null && q.getId().equals(questionId)))
            .findFirst().orElseThrow(() -> new IllegalArgumentException("Question not found: " + questionId));
        
        SurveyQuestion question = s.getQuestions().stream()
            .filter(q -> q.getId() != null && q.getId().equals(questionId))
            .findFirst().orElseThrow(() -> new IllegalArgumentException("Question not found: " + questionId));
        
        // Verificar que la encuesta no esté cerrada
        if (s.isClosed()) {
            throw new IllegalStateException("Survey is closed");
        }
        
        // Verificar que el usuario esté registrado al evento (solo si la encuesta tiene evento)
        if (s.getEvent() != null) {
            boolean isRegistered = registrationRepository.findByUserIdAndEventId(user.getId(), s.getEvent().getId()).isPresent();
            if (!isRegistered) {
                throw new IllegalStateException("Not registered to this event");
            }
        }
        // Si no tiene evento, es una encuesta de grupo y cualquier miembro puede responder

        // Verificar que no haya respondido ya esta pregunta
        boolean alreadyAnswered = answerRepository.findByQuestionId(questionId).stream()
                .anyMatch(a -> a.getRespondent().getId().equals(user.getId()));
        if (alreadyAnswered) {
            throw new IllegalStateException("Already answered this question");
        }

        SurveyAnswer sa = new SurveyAnswer();
        sa.setQuestion(question);
        sa.setRespondent(user);
        sa.setAnswer(answer);

        SurveyAnswer saved = answerRepository.save(sa);
        return Map.of(
            "id", saved.getId(),
            "questionId", saved.getQuestion().getId(),
            "respondentId", user.getId(),
            "answer", saved.getAnswer()
        );
    }

    @PostMapping("/{surveyId}/close")
    @PreAuthorize("hasAnyRole('ADMIN','SERVER')")
    @Transactional
    public Map<String, Object> close(@PathVariable Long surveyId) {
        Survey survey = surveyRepository.findById(surveyId).orElseThrow();
        survey.setClosed(true);
        surveyRepository.save(survey);
        return Map.of("surveyId", surveyId, "closed", true);
    }
}
