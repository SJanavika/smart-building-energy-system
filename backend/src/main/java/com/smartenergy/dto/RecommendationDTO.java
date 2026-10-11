package com.smartenergy.dto;

public class RecommendationDTO {

    private String id;
    private String category;
    private String title;
    private String description;
    private String priority; // HIGH, MEDIUM, LOW
    private Double estimatedSavingsKwh;
    private Double estimatedSavingsCost;
    private String currency = "₹";

    public RecommendationDTO() {
    }

    public RecommendationDTO(String id, String category, String title, String description, String priority, Double estimatedSavingsKwh, Double estimatedSavingsCost) {
        this.id = id;
        this.category = category;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.estimatedSavingsKwh = estimatedSavingsKwh;
        this.estimatedSavingsCost = estimatedSavingsCost;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public Double getEstimatedSavingsKwh() {
        return estimatedSavingsKwh;
    }

    public void setEstimatedSavingsKwh(Double estimatedSavingsKwh) {
        this.estimatedSavingsKwh = estimatedSavingsKwh;
    }

    public Double getEstimatedSavingsCost() {
        return estimatedSavingsCost;
    }

    public void setEstimatedSavingsCost(Double estimatedSavingsCost) {
        this.estimatedSavingsCost = estimatedSavingsCost;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
