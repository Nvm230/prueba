package com.univibe.event.dto;

import java.time.Instant;

public class EventStatsResponse {
    private long totalRegistrations;
    private long checkedInCount;
    private long pendingCheckInCount;
    private Instant lastCheckInAt;

    public EventStatsResponse() {}

    public EventStatsResponse(long totalRegistrations, long checkedInCount, long pendingCheckInCount, Instant lastCheckInAt) {
        this.totalRegistrations = totalRegistrations;
        this.checkedInCount = checkedInCount;
        this.pendingCheckInCount = pendingCheckInCount;
        this.lastCheckInAt = lastCheckInAt;
    }

    public long getTotalRegistrations() { return totalRegistrations; }
    public void setTotalRegistrations(long totalRegistrations) { this.totalRegistrations = totalRegistrations; }
    public long getCheckedInCount() { return checkedInCount; }
    public void setCheckedInCount(long checkedInCount) { this.checkedInCount = checkedInCount; }
    public long getPendingCheckInCount() { return pendingCheckInCount; }
    public void setPendingCheckInCount(long pendingCheckInCount) { this.pendingCheckInCount = pendingCheckInCount; }
    public Instant getLastCheckInAt() { return lastCheckInAt; }
    public void setLastCheckInAt(Instant lastCheckInAt) { this.lastCheckInAt = lastCheckInAt; }
}

