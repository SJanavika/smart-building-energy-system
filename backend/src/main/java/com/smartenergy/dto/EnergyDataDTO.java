package com.smartenergy.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class EnergyDataDTO {

    private Long id;

    @NotBlank(message = "Device name cannot be blank")
    private String deviceName;

    @NotNull(message = "Floor number is required")
    private Integer floorNumber;

    @NotNull(message = "Consumption is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Consumption must be greater than 0")
    private Double consumption;

    @NotNull(message = "Operating hours are required")
    @DecimalMin(value = "0.0", message = "Operating hours cannot be negative")
    private Double operatingHours;

    @NotNull(message = "Date is required")
    private LocalDate date;

    public EnergyDataDTO() {
    }

    public EnergyDataDTO(Long id, String deviceName, Integer floorNumber, Double consumption, Double operatingHours, LocalDate date) {
        this.id = id;
        this.deviceName = deviceName;
        this.floorNumber = floorNumber;
        this.consumption = consumption;
        this.operatingHours = operatingHours;
        this.date = date;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public Integer getFloorNumber() {
        return floorNumber;
    }

    public void setFloorNumber(Integer floorNumber) {
        this.floorNumber = floorNumber;
    }

    public Double getConsumption() {
        return consumption;
    }

    public void setConsumption(Double consumption) {
        this.consumption = consumption;
    }

    public Double getOperatingHours() {
        return operatingHours;
    }

    public void setOperatingHours(Double operatingHours) {
        this.operatingHours = operatingHours;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}
