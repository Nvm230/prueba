package com.univibe.survey.model;

import com.univibe.user.model.User;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonProperty; 
import jakarta.persistence.*;

@Entity
@Table(name = "survey_answers")
public class SurveyAnswer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JsonBackReference("question-answers")
    private SurveyQuestion question;

    @ManyToOne(optional = false)
    private User respondent;

    @Column(nullable = false)
    private String answer;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public SurveyQuestion getQuestion() { return question; }
    public void setQuestion(SurveyQuestion question) { this.question = question; }
    public User getRespondent() { return respondent; }
    public void setRespondent(User respondent) { this.respondent = respondent; }
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
}
