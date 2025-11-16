package com.univibe.event.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;

public class EventCreateRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Category is required")
    private String category;
    
    @NotBlank(message = "Description is required")
    private String description;
    
    private String faculty;
    private String career;
    
    @NotNull(message = "Start time is required")
    private Instant startTime;
    
    @NotNull(message = "End time is required")
    private Instant endTime;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getFaculty() { return faculty; }
    public void setFaculty(String faculty) { this.faculty = faculty; }
    public String getCareer() { return career; }
    public void setCareer(String career) { this.career = career; }
    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }
    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }
}
