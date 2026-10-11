package com.smartenergy.dto;

public class PredictionResponseDTO {

    private Double predictedUsage;      // in kWh
    private Double electricityRate;     // e.g. 8.0 INR
    private Double estimatedCost;       // predictedUsage * electricityRate
    private String unit = "kWh";
    private String currency = "₹";
    private String formula;

    public PredictionResponseDTO() {
    }

    public PredictionResponseDTO(Double predictedUsage, Double electricityRate, Double estimatedCost, String formula) {
        this.predictedUsage = predictedUsage;
        this.electricityRate = electricityRate;
        this.estimatedCost = estimatedCost;
        this.formula = formula;
    }

    public Double getPredictedUsage() {
        return predictedUsage;
    }

    public void setPredictedUsage(Double predictedUsage) {
        this.predictedUsage = predictedUsage;
    }

    public Double getElectricityRate() {
        return electricityRate;
    }

    public void setElectricityRate(Double electricityRate) {
        this.electricityRate = electricityRate;
    }

    public Double getEstimatedCost() {
        return estimatedCost;
    }

    public void setEstimatedCost(Double estimatedCost) {
        this.estimatedCost = estimatedCost;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getFormula() {
        return formula;
    }

    public void setFormula(String formula) {
        this.formula = formula;
    }
}
