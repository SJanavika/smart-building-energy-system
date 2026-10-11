package com.smartenergy.controller;

import com.smartenergy.dto.ReportDTO;
import com.smartenergy.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;

    @Autowired
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public ResponseEntity<List<ReportDTO>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @PostMapping("/generate")
    public ResponseEntity<ReportDTO> generateReport(@RequestParam(defaultValue = "MONTHLY") String type) {
        ReportDTO dto = reportService.generateReport(type);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> downloadPdfReport(@RequestParam(defaultValue = "MONTHLY") String type) {
        try {
            byte[] pdfBytes = reportService.generatePdfReport(type);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "Energy_Audit_Report_" + type + ".pdf");
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/export/excel")
    public ResponseEntity<byte[]> downloadExcelReport(@RequestParam(defaultValue = "MONTHLY") String type) {
        try {
            byte[] excelBytes = reportService.generateExcelReport(type);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            headers.setContentDispositionFormData("attachment", "Energy_Audit_Report_" + type + ".xlsx");
            headers.setContentLength(excelBytes.length);

            return new ResponseEntity<>(excelBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
