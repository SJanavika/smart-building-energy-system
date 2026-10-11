package com.smartenergy.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_name", nullable = false, length = 150)
    private String reportName;

    @Column(name = "report_type", nullable = false, length = 50)
    private String reportType; // DAILY, WEEKLY, MONTHLY

    @Column(name = "generated_date", updatable = false)
    private LocalDateTime generatedDate;

    @Column(name = "file_path", nullable = false, length = 255)
    private String filePath;

    @Column(name = "total_consumption")
    private Double totalConsumption;

    @Column(name = "total_cost")
    private Double totalCost;

    public Report() {
    }

    public Report(Long id, String reportName, String reportType, String filePath, Double totalConsumption, Double totalCost) {
        this.id = id;
        this.reportName = reportName;
        this.reportType = reportType;
        this.filePath = filePath;
        this.totalConsumption = totalConsumption;
        this.totalCost = totalCost;
    }

    @PrePersist
    protected void onCreate() {
        this.generatedDate = LocalDateTime.now();
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
}
