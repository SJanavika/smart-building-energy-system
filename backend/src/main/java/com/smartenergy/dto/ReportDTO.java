package com.smartenergy.dto;

import java.time.LocalDateTime;

public class ReportDTO {

    private Long id;
    private String reportName;
    private String reportType; // DAILY, WEEKLY, MONTHLY
    private LocalDateTime generatedDate;
    private String filePath;
    private Double totalConsumption;
    private Double totalCost;
    private Double predictedConsumption;
    private Double potentialSavings;

    public ReportDTO() {
    }

    public ReportDTO(Long id, String reportName, String reportType, LocalDateTime generatedDate, String filePath, Double totalConsumption, Double totalCost) {
        this.id = id;
        this.reportName = reportName;
        this.reportType = reportType;
        this.generatedDate = generatedDate;
        this.filePath = filePath;
        this.totalConsumption = totalConsumption;
        this.totalCost = totalCost;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getReportName() {
        return reportName;
    }

    public void setReportName(String reportName) {
        this.reportName = reportName;
    }

    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public LocalDateTime getGeneratedDate() {
        return generatedDate;
    }

    public void setGeneratedDate(LocalDateTime generatedDate) {
        this.generatedDate = generatedDate;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public Double getTotalConsumption() {
        return totalConsumption;
    }

    public void setTotalConsumption(Double totalConsumption) {
        this.totalConsumption = totalConsumption;
    }

    public Double getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(Double totalCost) {
        this.totalCost = totalCost;
    }

    public Double getPredictedConsumption() {
        return predictedConsumption;
    }

    public void setPredictedConsumption(Double predictedConsumption) {
        this.predictedConsumption = predictedConsumption;
    }

    public Double getPotentialSavings() {
        return potentialSavings;
    }

    public void setPotentialSavings(Double potentialSavings) {
        this.potentialSavings = potentialSavings;
    }
}
