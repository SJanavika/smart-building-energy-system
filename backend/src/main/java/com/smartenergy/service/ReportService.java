package com.smartenergy.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import com.smartenergy.dto.ReportDTO;
import com.smartenergy.model.EnergyData;
import com.smartenergy.model.Report;
import com.smartenergy.repository.EnergyDataRepository;
import com.smartenergy.repository.ReportRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final EnergyDataRepository energyRepository;

    @Value("${energy.tariff.rate-per-kwh:8.0}")
    private Double tariffRate;

    @Value("${energy.reports.storage-dir:./reports_storage/}")
    private String storageDir;

    @Autowired
    public ReportService(ReportRepository reportRepository, EnergyDataRepository energyRepository) {
        this.reportRepository = reportRepository;
        this.energyRepository = energyRepository;
    }

    public List<ReportDTO> getAllReports() {
        return reportRepository.findAllByOrderByGeneratedDateDesc()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ReportDTO generateReport(String reportType) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate;

        if ("DAILY".equalsIgnoreCase(reportType)) {
            startDate = endDate;
        } else if ("WEEKLY".equalsIgnoreCase(reportType)) {
            startDate = endDate.minusDays(7);
        } else {
            reportType = "MONTHLY";
            startDate = endDate.minusDays(30);
        }

        List<EnergyData> records = energyRepository.findByDateBetween(startDate, endDate);
        double totalKwh = records.stream().mapToDouble(EnergyData::getConsumption).sum();
        double totalCost = totalKwh * tariffRate;

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String filename = "Energy_Audit_" + reportType.toUpperCase() + "_" + timestamp + ".pdf";

        File dir = new File(storageDir);
        if (!dir.exists()) {
            dir.mkdirs();
        }

        String fullPath = storageDir + filename;

        // Persist report entity
        Report report = new Report();
        report.setReportName("Smart Energy Audit (" + reportType.toUpperCase() + ")");
        report.setReportType(reportType.toUpperCase());
        report.setFilePath(fullPath);
        report.setTotalConsumption(Math.round(totalKwh * 100.0) / 100.0);
        report.setTotalCost(Math.round(totalCost * 100.0) / 100.0);

        Report saved = reportRepository.save(report);
        return mapToDTO(saved);
    }

    public byte[] generatePdfReport(String reportType) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 54, 36);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Document Header
            com.lowagie.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, new Color(14, 116, 144));
            Paragraph title = new Paragraph("Smart Building Energy Management System", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            com.lowagie.text.Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 12, Color.DARK_GRAY);
            Paragraph subTitle = new Paragraph("Official Energy Audit & Optimization Report (" + reportType.toUpperCase() + ")", subTitleFont);
            subTitle.setAlignment(Element.ALIGN_CENTER);
            document.add(subTitle);

            Paragraph datePara = new Paragraph("Generated on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm:ss")), subTitleFont);
            datePara.setAlignment(Element.ALIGN_CENTER);
            datePara.setSpacingAfter(20);
            document.add(datePara);

            // Summary Table
            LocalDate startDate = "DAILY".equalsIgnoreCase(reportType) ? LocalDate.now() : ("WEEKLY".equalsIgnoreCase(reportType) ? LocalDate.now().minusDays(7) : LocalDate.now().minusDays(30));
            List<EnergyData> records = energyRepository.findByDateBetween(startDate, LocalDate.now());
            double totalKwh = records.stream().mapToDouble(EnergyData::getConsumption).sum();
            double totalCost = totalKwh * tariffRate;

            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(100);
            summaryTable.setSpacingAfter(20);

            addTableCell(summaryTable, "Metric", true, new Color(241, 245, 249));
            addTableCell(summaryTable, "Value", true, new Color(241, 245, 249));
            addTableCell(summaryTable, "Audit Period", false, Color.WHITE);
            addTableCell(summaryTable, startDate + " to " + LocalDate.now(), false, Color.WHITE);
            addTableCell(summaryTable, "Total Energy Consumption", false, Color.WHITE);
            addTableCell(summaryTable, String.format("%.2f kWh", totalKwh), false, Color.WHITE);
            addTableCell(summaryTable, "Total Energy Cost (Tariff @ ₹" + tariffRate + "/kWh)", false, Color.WHITE);
            addTableCell(summaryTable, String.format("₹ %.2f", totalCost), false, Color.WHITE);
            addTableCell(summaryTable, "Monitored Telemetry Records", false, Color.WHITE);
            addTableCell(summaryTable, String.valueOf(records.size()), false, Color.WHITE);

            document.add(summaryTable);

            // Detailed Telemetry Table
            Paragraph section = new Paragraph("Device Consumption Breakdown", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new Color(30, 41, 59)));
            section.setSpacingAfter(10);
            document.add(section);

            PdfPTable table = new PdfPTable(5);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{1.2f, 3.0f, 1.5f, 2.0f, 2.0f});

            addTableCell(table, "Date", true, new Color(224, 242, 254));
            addTableCell(table, "Device Name", true, new Color(224, 242, 254));
            addTableCell(table, "Floor", true, new Color(224, 242, 254));
            addTableCell(table, "Usage (kWh)", true, new Color(224, 242, 254));
            addTableCell(table, "Cost (₹)", true, new Color(224, 242, 254));

            for (EnergyData item : records.stream().limit(50).collect(Collectors.toList())) {
                addTableCell(table, item.getDate().toString(), false, Color.WHITE);
                addTableCell(table, item.getDeviceName(), false, Color.WHITE);
                addTableCell(table, "Floor " + item.getFloorNumber(), false, Color.WHITE);
                addTableCell(table, String.format("%.2f", item.getConsumption()), false, Color.WHITE);
                addTableCell(table, String.format("%.2f", item.getConsumption() * tariffRate), false, Color.WHITE);
            }

            document.add(table);
            document.close();
        } catch (DocumentException e) {
            throw new IOException("Failed to create PDF document: " + e.getMessage());
        }

        return out.toByteArray();
    }

    public byte[] generateExcelReport(String reportType) throws IOException {
        LocalDate startDate = "DAILY".equalsIgnoreCase(reportType) ? LocalDate.now() : ("WEEKLY".equalsIgnoreCase(reportType) ? LocalDate.now().minusDays(7) : LocalDate.now().minusDays(30));
        List<EnergyData> records = energyRepository.findByDateBetween(startDate, LocalDate.now());

        try (org.apache.poi.ss.usermodel.Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            org.apache.poi.ss.usermodel.Sheet sheet = workbook.createSheet("Energy Audit - " + reportType);

            org.apache.poi.ss.usermodel.Row header = sheet.createRow(0);
            String[] headers = {"ID", "Date", "Device Name", "Floor Number", "Consumption (kWh)", "Operating Hours", "Estimated Cost (₹)"};
            for (int i = 0; i < headers.length; i++) {
                org.apache.poi.ss.usermodel.Cell cell = header.createCell(i);
                cell.setCellValue(headers[i]);
            }

            int rowIdx = 1;
            for (EnergyData item : records) {
                org.apache.poi.ss.usermodel.Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(item.getId() != null ? item.getId() : 0);
                row.createCell(1).setCellValue(item.getDate().toString());
                row.createCell(2).setCellValue(item.getDeviceName());
                row.createCell(3).setCellValue(item.getFloorNumber());
                row.createCell(4).setCellValue(item.getConsumption());
                row.createCell(5).setCellValue(item.getOperatingHours());
                row.createCell(6).setCellValue(item.getConsumption() * tariffRate);
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        }
    }

    private void addTableCell(PdfPTable table, String text, boolean isHeader, Color bgColor) {
        com.lowagie.text.Font font = isHeader
                ? FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10, Color.BLACK)
                : FontFactory.getFont(FontFactory.HELVETICA, 9, Color.DARK_GRAY);

        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBackgroundColor(bgColor);
        cell.setPadding(6);
        cell.setHorizontalAlignment(Element.ALIGN_LEFT);
        table.addCell(cell);
    }

    private ReportDTO mapToDTO(Report report) {
        return new ReportDTO(
                report.getId(),
                report.getReportName(),
                report.getReportType(),
                report.getGeneratedDate(),
                report.getFilePath(),
                report.getTotalConsumption(),
                report.getTotalCost()
        );
    }
}
