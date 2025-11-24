package com.univibe.survey.dto;

import com.univibe.event.dto.EventResponseDTO;
import com.univibe.event.dto.UserSummaryDTO;
import com.univibe.survey.model.Survey;
import com.univibe.survey.model.SurveyAnswer;
import com.univibe.survey.model.SurveyQuestion;
import com.univibe.user.model.User;

import java.util.List;
import java.util.stream.Collectors;

public class SurveyResponseDTO {
    private final Long id;
    private final String title;
    private final boolean closed;
    private final EventResponseDTO event;
    private final List<QuestionDTO> questions;

    public SurveyResponseDTO(Survey survey) {
        this.id = survey.getId();
        this.title = survey.getTitle();
        this.closed = survey.isClosed();
        this.event = survey.getEvent() != null ? new EventResponseDTO(survey.getEvent()) : null;
        this.questions = survey.getQuestions() == null
                ? List.of()
                : survey.getQuestions().stream()
                    .map(QuestionDTO::new)
                    .collect(Collectors.toList());
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public boolean isClosed() {
        return closed;
    }

    public EventResponseDTO getEvent() {
        return event;
    }

    public List<QuestionDTO> getQuestions() {
        return questions;
    }

    public static class QuestionDTO {
        private final Long id;
        private final String text;
        private final List<AnswerDTO> answers;

        public QuestionDTO(SurveyQuestion question) {
            this.id = question.getId();
            this.text = question.getText();
            this.answers = question.getAnswers() == null
                    ? List.of()
                    : question.getAnswers().stream()
                        .map(AnswerDTO::new)
                        .collect(Collectors.toList());
        }

        public Long getId() {
            return id;
        }

        public String getText() {
            return text;
        }

        public List<AnswerDTO> getAnswers() {
            return answers;
        }
    }

    public static class AnswerDTO {
        private final Long id;
        private final String answer;
        private final UserSummaryDTO respondent;

        public AnswerDTO(SurveyAnswer surveyAnswer) {
            this.id = surveyAnswer.getId();
            this.answer = surveyAnswer.getAnswer();
            User respondentUser = surveyAnswer.getRespondent();
            if (respondentUser != null) {
                this.respondent = new UserSummaryDTO(
                        respondentUser.getId(),
                        respondentUser.getName(),
                        respondentUser.getEmail(),
                        respondentUser.getProfilePictureUrl()
                );
            } else {
                this.respondent = null;
            }
        }

        public Long getId() {
            return id;
        }

        public String getAnswer() {
            return answer;
        }

        public UserSummaryDTO getRespondent() {
            return respondent;
        }
    }
}

