package com.univibe.survey.web;
import java.util.Map;
import java.util.List;
import java.util.Optional;

import com.univibe.event.repo.EventRepository;
import com.univibe.survey.model.Survey;
import com.univibe.survey.model.SurveyAnswer;
import com.univibe.survey.model.SurveyQuestion;
import com.univibe.survey.repo.SurveyAnswerRepository;
import com.univibe.survey.repo.SurveyRepository;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/surveys")
public class SurveyController {
    private final SurveyRepository surveyRepository;
    private final SurveyAnswerRepository answerRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public SurveyController(SurveyRepository surveyRepository, SurveyAnswerRepository answerRepository, EventRepository eventRepository, UserRepository userRepository) {
        this.surveyRepository = surveyRepository;
        this.answerRepository = answerRepository;
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Survey> list(@RequestParam Optional<Long> eventId) {
        return eventId.map(surveyRepository::findByEventId).orElseGet(surveyRepository::findAll);
    }

    @GetMapping("/{surveyId}")
    public Survey get(@PathVariable Long surveyId) {
        return surveyRepository.findById(surveyId).orElseThrow();
    }

@PostMapping
@Transactional
@org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN','SERVER')")
public Map<String, Object> create(@RequestParam Long eventId,
                                  @RequestParam String title,
                                  @RequestParam List<String> questions) {
    Survey s = new Survey();
    s.setEvent(eventRepository.findById(eventId).orElseThrow());
    s.setTitle(title);
    for (String q : questions) {
        SurveyQuestion sq = new SurveyQuestion();
        sq.setSurvey(s);
        sq.setText(q);
        s.getQuestions().add(sq);
    }
    Survey saved = surveyRepository.save(s);
    return Map.of(
        "surveyId", saved.getId(),
        "questionIds", saved.getQuestions().stream().map(SurveyQuestion::getId).toList()
    );
}
@PostMapping("/{questionId}/answer")
public Map<String, Object> answer(@PathVariable Long questionId,
                                  @RequestParam Long userId,
                                  @RequestParam String answer) {
    Survey s = surveyRepository.findAll().stream()
        .filter(sv -> sv.getQuestions().stream().anyMatch(q -> q.getId().equals(questionId)))
        .findFirst().orElseThrow();
    SurveyQuestion question = s.getQuestions().stream()
        .filter(q -> q.getId().equals(questionId))
        .findFirst().orElseThrow();

    SurveyAnswer sa = new SurveyAnswer();
    sa.setQuestion(question);
    User u = userRepository.findById(userId).orElseThrow();
    sa.setRespondent(u);
    sa.setAnswer(answer);

    SurveyAnswer saved = answerRepository.save(sa);
    return Map.of(
        "id", saved.getId(),
        "questionId", saved.getQuestion().getId(),
        "respondentId", u.getId(),
        "answer", saved.getAnswer()
    );
}

}
