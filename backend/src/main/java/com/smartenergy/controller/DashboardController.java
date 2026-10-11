package com.smartenergy.controller;

import com.smartenergy.dto.DashboardSummaryDTO;
import com.smartenergy.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @Autowired
    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<DashboardSummaryDTO> getDashboardSummary() {
        DashboardSummaryDTO summary = dashboardService.getDashboardSummary();
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/trends/daily")
    public ResponseEntity<List<DashboardSummaryDTO.DailyPoint>> getDailyTrends() {
        return ResponseEntity.ok(dashboardService.getDashboardSummary().getDailyTrend());
    }

    @GetMapping("/trends/weekly")
    public ResponseEntity<List<DashboardSummaryDTO.WeeklyPoint>> getWeeklyTrends() {
        return ResponseEntity.ok(dashboardService.getDashboardSummary().getWeeklyTrend());
    }

    @GetMapping("/trends/monthly")
    public ResponseEntity<List<DashboardSummaryDTO.MonthlyPoint>> getMonthlyTrends() {
        return ResponseEntity.ok(dashboardService.getDashboardSummary().getMonthlyTrend());
    }

    @GetMapping("/breakdown/devices")
    public ResponseEntity<List<DashboardSummaryDTO.DeviceBreakdown>> getDeviceBreakdown() {
        return ResponseEntity.ok(dashboardService.getDashboardSummary().getDeviceBreakdown());
    }
}
