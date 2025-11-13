package com.univibe.repository;

import com.univibe.event.model.Event;
import com.univibe.event.model.EventStatus;
import com.univibe.event.repo.EventRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.Instant;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class EventRepositoryTest {

    @Autowired
    private EventRepository eventRepository;

    private Event createValidEvent(String title) {
        Event e = new Event();
        e.setTitle(title);
        e.setCategory("General");
        e.setDescription("Sample event");
        e.setFaculty("UTEC");
        e.setCareer("Software");
        e.setStatus(EventStatus.LIVE);
        e.setStartTime(Instant.now());
        e.setEndTime(Instant.now().plusSeconds(3600));
        return e;
    }

    @Test
    void testFindByStatus() {
        Event e = createValidEvent("Tech Fair");
        eventRepository.save(e);

        List<Event> result = eventRepository.findByStatus(EventStatus.LIVE);
        assertThat(result).isNotEmpty();
        assertThat(result.get(0).getTitle()).isEqualTo("Tech Fair");
    }

    @Test
    void testFindByCategory() {
        Event e = createValidEvent("AI Summit");
        eventRepository.save(e);

        List<Event> found = eventRepository.findByCategory("General");
        assertThat(found).isNotEmpty();
    }
}
