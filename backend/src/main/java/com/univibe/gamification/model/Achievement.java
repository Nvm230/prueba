package com.univibe.gamification.model;

import jakarta.persistence.*;

@Entity
@Table(name = "achievements")
public class Achievement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @Column(length = 50)
    private String category;

    @Column(length = 20)
    private String rarity = "COMMON";

    @Column(length = 255)
    private String icon;

    @Column(name = "max_progress")
    private Integer maxProgress = 1;

    private Integer points = 10;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getRarity() { return rarity; }
    public void setRarity(String rarity) { this.rarity = rarity; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public Integer getMaxProgress() { return maxProgress; }
    public void setMaxProgress(Integer maxProgress) { this.maxProgress = maxProgress; }
    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }
}
