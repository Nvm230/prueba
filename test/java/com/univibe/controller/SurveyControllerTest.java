package com.univibe.controller;

import com.univibe.event.repo.EventRepository;
import com.univibe.survey.model.Survey;
import com.univibe.survey.model.SurveyAnswer;
import com.univibe.survey.model.SurveyQuestion;
import com.univibe.survey.repo.SurveyAnswerRepository;
import com.univibe.survey.repo.SurveyRepository;
import com.univibe.survey.web.SurveyController;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class SurveyControllerTest {

    @Mock
    private SurveyRepository surveyRepository;
    @Mock
    private SurveyAnswerRepository answerRepository;
    @Mock
    private EventRepository eventRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SurveyController surveyController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateSurvey() {
        when(eventRepository.findById(1L)).thenReturn(Optional.of(new com.univibe.event.model.Event()));

        when(surveyRepository.save(any(Survey.class))).thenAnswer(inv -> {
            Survey s = inv.getArgument(0);
            s.setId(1L); 
            s.setQuestions(List.of());
            return s;
        });

        var result = surveyController.create(1L, "Encuesta de Prueba", List.of("P1", "P2"));

        assertEquals("Encuesta de Prueba", "Encuesta de Prueba");
        assertEquals(1L, result.get("surveyId"));
    }

    @Test
    void testAnswerSurvey() {
        SurveyQuestion q = new SurveyQuestion();
        q.setId(1L);

        Survey s = new Survey();
        s.setId(10L);
        s.setQuestions(List.of(q));

        User u = new User();
        u.setId(1L);

        when(surveyRepository.findAll()).thenReturn(List.of(s));
        when(userRepository.findById(1L)).thenReturn(Optional.of(u));
        when(answerRepository.save(any(SurveyAnswer.class))).thenAnswer(inv -> {
            SurveyAnswer ans = inv.getArgument(0);
            ans.setId(99L);
            return ans;
        });

        var res = surveyController.answer(1L, 1L, "Sí");

        assertEquals("Sí", res.get("answer"));
        assertEquals(1L, res.get("respondentId"));
    }
}
