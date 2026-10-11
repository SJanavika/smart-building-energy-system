package com.smartenergy.dto;

import java.util.List;
import java.util.Map;

public class DashboardSummaryDTO {

    private Double totalEnergyConsumption;
    private Double totalEnergyCost;
    private String highestConsumingDevice;
    private Double highestDeviceConsumption;
    private Double aiPredictedEnergyUsage;
    private Double aiEstimatedCost;
    private Long totalRecordsCount;
    private Integer activeDevicesCount;

    // Daily Trend
    private List<DailyPoint> dailyTrend;
    // Weekly Trend
    private List<WeeklyPoint> weeklyTrend;
    // Monthly Trend
    private List<MonthlyPoint> monthlyTrend;
    // Device Breakdown
    private List<DeviceBreakdown> deviceBreakdown;

    public DashboardSummaryDTO() {
    }

    public static class DailyPoint {
        private String date;
        private Double consumption;
        private Double cost;

        public DailyPoint() {}
        public DailyPoint(String date, Double consumption, Double cost) {
            this.date = date;
            this.consumption = consumption;
            this.cost = cost;
        }
        public String getDate() { return date; }
        public void setDate(String date) { this.date = date; }
        public Double getConsumption() { return consumption; }
        public void setConsumption(Double consumption) { this.consumption = consumption; }
        public Double getCost() { return cost; }
        public void setCost(Double cost) { this.cost = cost; }
    }

    public static class WeeklyPoint {
        private String weekLabel;
        private Double consumption;
        private Double cost;

        public WeeklyPoint() {}
        public WeeklyPoint(String weekLabel, Double consumption, Double cost) {
            this.weekLabel = weekLabel;
            this.consumption = consumption;
            this.cost = cost;
        }
        public String getWeekLabel() { return weekLabel; }
        public void setWeekLabel(String weekLabel) { this.weekLabel = weekLabel; }
        public Double getConsumption() { return consumption; }
        public void setConsumption(Double consumption) { this.consumption = consumption; }
        public Double getCost() { return cost; }
        public void setCost(Double cost) { this.cost = cost; }
    }

    public static class MonthlyPoint {
        private String monthLabel;
        private Double consumption;
        private Double cost;

        public MonthlyPoint() {}
        public MonthlyPoint(String monthLabel, Double consumption, Double cost) {
            this.monthLabel = monthLabel;
            this.consumption = consumption;
            this.cost = cost;
        }
        public String getMonthLabel() { return monthLabel; }
        public void setMonthLabel(String monthLabel) { this.monthLabel = monthLabel; }
        public Double getConsumption() { return consumption; }
        public void setConsumption(Double consumption) { this.consumption = consumption; }
        public Double getCost() { return cost; }
        public void setCost(Double cost) { this.cost = cost; }
    }

    public static class DeviceBreakdown {
        private String deviceName;
        private Double totalKwh;
        private Double percentage;

        public DeviceBreakdown() {}
        public DeviceBreakdown(String deviceName, Double totalKwh, Double percentage) {
            this.deviceName = deviceName;
            this.totalKwh = totalKwh;
            this.percentage = percentage;
        }
        public String getDeviceName() { return deviceName; }
        public void setDeviceName(String deviceName) { this.deviceName = deviceName; }
        public Double getTotalKwh() { return totalKwh; }
        public void setTotalKwh(Double totalKwh) { this.totalKwh = totalKwh; }
        public Double getPercentage() { return percentage; }
        public void setPercentage(Double percentage) { this.percentage = percentage; }
    }

    public Double getTotalEnergyConsumption() {
        return totalEnergyConsumption;
    }

    public void setTotalEnergyConsumption(Double totalEnergyConsumption) {
        this.totalEnergyConsumption = totalEnergyConsumption;
    }

    public Double getTotalEnergyCost() {
        return totalEnergyCost;
    }

    public void setTotalEnergyCost(Double totalEnergyCost) {
        this.totalEnergyCost = totalEnergyCost;
    }

    public String getHighestConsumingDevice() {
        return highestConsumingDevice;
    }

    public void setHighestConsumingDevice(String highestConsumingDevice) {
        this.highestConsumingDevice = highestConsumingDevice;
    }

    public Double getHighestDeviceConsumption() {
        return highestDeviceConsumption;
    }

    public void setHighestDeviceConsumption(Double highestDeviceConsumption) {
        this.highestDeviceConsumption = highestDeviceConsumption;
    }

    public Double getAiPredictedEnergyUsage() {
        return aiPredictedEnergyUsage;
    }

    public void setAiPredictedEnergyUsage(Double aiPredictedEnergyUsage) {
        this.aiPredictedEnergyUsage = aiPredictedEnergyUsage;
    }

    public Double getAiEstimatedCost() {
        return aiEstimatedCost;
    }

    public void setAiEstimatedCost(Double aiEstimatedCost) {
        this.aiEstimatedCost = aiEstimatedCost;
    }

    public Long getTotalRecordsCount() {
        return totalRecordsCount;
    }

    public void setTotalRecordsCount(Long totalRecordsCount) {
        this.totalRecordsCount = totalRecordsCount;
    }

    public Integer getActiveDevicesCount() {
        return activeDevicesCount;
    }

    public void setActiveDevicesCount(Integer activeDevicesCount) {
        this.activeDevicesCount = activeDevicesCount;
    }

    public List<DailyPoint> getDailyTrend() {
        return dailyTrend;
    }

    public void setDailyTrend(List<DailyPoint> dailyTrend) {
        this.dailyTrend = dailyTrend;
    }

    public List<WeeklyPoint> getWeeklyTrend() {
        return weeklyTrend;
    }

    public void setWeeklyTrend(List<WeeklyPoint> weeklyTrend) {
        this.weeklyTrend = weeklyTrend;
    }

    public List<MonthlyPoint> getMonthlyTrend() {
        return monthlyTrend;
    }

    public void setMonthlyTrend(List<MonthlyPoint> monthlyTrend) {
        this.monthlyTrend = monthlyTrend;
    }

    public List<DeviceBreakdown> getDeviceBreakdown() {
        return deviceBreakdown;
    }

    public void setDeviceBreakdown(List<DeviceBreakdown> deviceBreakdown) {
        this.deviceBreakdown = deviceBreakdown;
    }
}
