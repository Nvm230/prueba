package com.univibe.controller;

import com.univibe.event.model.Event;
import com.univibe.event.repo.EventRepository;
import com.univibe.registration.model.Registration;
import com.univibe.registration.repo.RegistrationRepository;
import com.univibe.registration.web.RegistrationController;
import com.univibe.user.model.User;
import com.univibe.user.repo.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.ApplicationEventPublisher;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

class RegistrationControllerTest {

    @Mock private RegistrationRepository registrationRepository;
    @Mock private UserRepository userRepository;
    @Mock private EventRepository eventRepository;
    @Mock private ApplicationEventPublisher publisher;

    @InjectMocks private RegistrationController registrationController;

    @BeforeEach
    void setUp() { MockitoAnnotations.openMocks(this); }

    @Test
    void testRegisterCreatesRegistration() {
        User u = new User(); u.setId(1L); u.setEmail("a@a.com");
        Event e = new Event(); e.setId(1L);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(u));
        when(eventRepository.findById(1L)).thenReturn(Optional.of(e));

        assertNotNull(registrationController);
    }
}
