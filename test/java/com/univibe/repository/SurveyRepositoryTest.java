package com.univibe.repository;

import com.univibe.event.model.Event;
import com.univibe.event.repo.EventRepository;
import com.univibe.survey.model.Survey;
import com.univibe.survey.repo.SurveyRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.Instant;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class SurveyRepositoryTest {

    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private EventRepository eventRepository;

    private Event createValidEvent(String title) {
        Event e = new Event();
        e.setTitle(title);
        e.setCategory("General");
        e.setDescription("Survey-linked event");
        e.setStartTime(Instant.now());
        e.setEndTime(Instant.now().plusSeconds(3600));
        e.setFaculty("UTEC");
        e.setCareer("Software");
        return e;
    }

    @Test
    void testSaveAndFind() {
        Event event = eventRepository.save(createValidEvent("Feedback Day"));

        Survey survey = new Survey();
        survey.setTitle("Feedback Survey");
        survey.setEvent(event);
        surveyRepository.save(survey);

        Survey found = surveyRepository.findById(survey.getId()).orElseThrow();
        assertThat(found.getTitle()).isEqualTo("Feedback Survey");
        assertThat(found.getEvent().getTitle()).isEqualTo("Feedback Day");
    }
}
