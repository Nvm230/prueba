package com.univibe.event.dto;

import com.univibe.event.model.Event;
import com.univibe.event.model.EventStatus;
import com.univibe.event.model.EventVisibility;
import com.univibe.user.model.User;

import java.time.Instant;
import java.util.Set;

public class EventResponseDTO {
    private Long id;
    private String title;
    private String category;
    private String description;
    private String faculty;
    private String career;
    private EventStatus status;
    private Instant startTime;
    private Instant endTime;
    private Set<String> tags;
    private UserSummaryDTO createdBy;
    private EventVisibility visibility;
    private boolean groupRestricted;
    private Integer maxCapacity;

    public EventResponseDTO() {}

    public EventResponseDTO(Event event) {
        this.id = event.getId();
        this.title = event.getTitle();
        this.category = event.getCategory();
        this.description = event.getDescription();
        this.faculty = event.getFaculty();
        this.career = event.getCareer();
        this.status = event.getStatus();
        this.startTime = event.getStartTime();
        this.endTime = event.getEndTime();
        this.tags = event.getTags();
        this.visibility = event.getVisibility();
        this.maxCapacity = event.getMaxCapacity();
        
        // Convertir User a DTO de forma segura
        if (event.getCreatedBy() != null) {
            User user = event.getCreatedBy();
            try {
                // Si es un proxy, intentar inicializarlo primero
                if (user instanceof org.hibernate.proxy.HibernateProxy) {
                    org.hibernate.proxy.HibernateProxy proxy = (org.hibernate.proxy.HibernateProxy) user;
                    // Intentar inicializar el proxy
                    org.hibernate.Hibernate.initialize(user);
                    if (!proxy.getHibernateLazyInitializer().isUninitialized()) {
                        user = (User) proxy.getHibernateLazyInitializer().getImplementation();
                        this.createdBy = new UserSummaryDTO(
                            user.getId(),
                            user.getName(),
                            user.getEmail(),
                            user.getProfilePictureUrl()
                        );
                    } else {
                        // Si no se puede inicializar, usar solo el ID si está disponible
                        try {
                            Long id = (Long) proxy.getHibernateLazyInitializer().getIdentifier();
                            this.createdBy = new UserSummaryDTO(id, null, null, null);
                        } catch (Exception e) {
                            this.createdBy = null;
                        }
                    }
                } else {
                    // No es un proxy, usar directamente
                    this.createdBy = new UserSummaryDTO(
                        user.getId(),
                        user.getName(),
                        user.getEmail(),
                        user.getProfilePictureUrl()
                    );
                }
            } catch (Exception e) {
                // Si algo falla, establecer a null
                this.createdBy = null;
            }
        } else {
            this.createdBy = null;
        }
    }

    // Getters y setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public EventStatus getStatus() { return status; }
    public void setStatus(EventStatus status) { this.status = status; }
    public Instant getStartTime() { return startTime; }
    public void setStartTime(Instant startTime) { this.startTime = startTime; }
    public Instant getEndTime() { return endTime; }
    public void setEndTime(Instant endTime) { this.endTime = endTime; }
    public Set<String> getTags() { return tags; }
    public void setTags(Set<String> tags) { this.tags = tags; }
    public UserSummaryDTO getCreatedBy() { return createdBy; }
    public void setCreatedBy(UserSummaryDTO createdBy) { this.createdBy = createdBy; }
    public EventVisibility getVisibility() { return visibility; }
    public void setVisibility(EventVisibility visibility) { this.visibility = visibility; }
    public boolean isGroupRestricted() { return groupRestricted; }
    public void setGroupRestricted(boolean groupRestricted) { this.groupRestricted = groupRestricted; }
    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }
}

