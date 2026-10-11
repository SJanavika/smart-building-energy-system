package com.smartenergy.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class PredictionRequestDTO {

    @NotNull(message = "Temperature is required")
    private Double temperature;

    @NotNull(message = "Humidity is required")
    @Min(value = 0, message = "Humidity cannot be less than 0%")
    @Max(value = 100, message = "Humidity cannot exceed 100%")
    private Double humidity;

    @NotNull(message = "Occupancy count is required")
    @Min(value = 0, message = "Occupancy cannot be negative")
    private Integer occupancy;

    @NotNull(message = "Hour of day is required")
    @Min(value = 0, message = "Hour must be between 0 and 23")
    @Max(value = 23, message = "Hour must be between 0 and 23")
    private Integer hour;

    private Double electricityRate; // Optional, default ₹8/kWh

    public PredictionRequestDTO() {
    }

    public PredictionRequestDTO(Double temperature, Double humidity, Integer occupancy, Integer hour) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.occupancy = occupancy;
        this.hour = hour;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public Double getHumidity() {
        return humidity;
    }

    public void setHumidity(Double humidity) {
        this.humidity = humidity;
    }

    public Integer getOccupancy() {
        return occupancy;
    }

    public void setOccupancy(Integer occupancy) {
        this.occupancy = occupancy;
    }

    public Integer getHour() {
        return hour;
    }

    public void setHour(Integer hour) {
        this.hour = hour;
    }

    public Double getElectricityRate() {
        return electricityRate;
    }

    public void setElectricityRate(Double electricityRate) {
        this.electricityRate = electricityRate;
    }
}
