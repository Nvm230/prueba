package com.univibe.common.event;

import java.time.Instant;

public class RegistrationCreatedEvent {
    private final String userEmail;
    private final String eventTitle;
    private final Instant eventStartTime;

    public RegistrationCreatedEvent(String userEmail, String eventTitle, Instant eventStartTime) {
        this.userEmail = userEmail;
        this.eventTitle = eventTitle;
        this.eventStartTime = eventStartTime;
    }

    public String getUserEmail() { return userEmail; }
    public String getEventTitle() { return eventTitle; }
    public Instant getEventStartTime() { return eventStartTime; }
}
