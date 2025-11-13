package com.univibe.utils;

import com.univibe.event.model.Event;
import com.univibe.user.model.Role;
import com.univibe.user.model.User;

import java.time.Instant;

public class TestFactory {

    public static User sampleUser(String email) {
        User u = new User();
        u.setEmail(email);
        u.setName("Test User");
        u.setPasswordHash("dummy123");
        u.setRole(Role.USER);
        u.setPoints(0);
        u.setCreatedAt(Instant.now());
        return u;
    }

    public static Event sampleEvent(String title) {
        Event e = new Event();
        e.setTitle(title);
        e.setCategory("General");
        e.setDescription("Sample description");
        e.setStartTime(Instant.now());
        e.setEndTime(Instant.now().plusSeconds(3600));
        e.setFaculty("UTEC");
        e.setCareer("Software");
        return e;
    }
}
