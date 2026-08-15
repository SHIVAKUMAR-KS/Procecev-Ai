package com.speechtotext.dto;

import jakarta.validation.constraints.NotBlank;

public class TranscriptionRequest {

    @NotBlank(message = "Text is required")
    private String text;

    private String language;
    private Double confidenceScore;

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }
}
