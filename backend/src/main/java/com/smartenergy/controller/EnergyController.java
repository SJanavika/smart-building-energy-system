package com.smartenergy.controller;

import com.smartenergy.dto.EnergyDataDTO;
import com.smartenergy.service.EnergyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/energy")
public class EnergyController {

    private final EnergyService energyService;

    @Autowired
    public EnergyController(EnergyService energyService) {
        this.energyService = energyService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllRecords(
            @RequestParam(required = false) String device,
            @RequestParam(required = false) Integer floor,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EnergyDataDTO> pageResult = energyService.getEnergyRecords(device, floor, startDate, endDate, pageable);

        Map<String, Object> response = new HashMap<>();
        response.put("content", pageResult.getContent());
        response.put("currentPage", pageResult.getNumber());
        response.put("totalItems", pageResult.getTotalElements());
        response.put("totalPages", pageResult.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EnergyDataDTO> getRecordById(@PathVariable Long id) {
        return ResponseEntity.ok(energyService.getRecordById(id));
    }

    @PostMapping
    public ResponseEntity<EnergyDataDTO> createRecord(@Valid @RequestBody EnergyDataDTO dto) {
        EnergyDataDTO created = energyService.createRecord(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EnergyDataDTO> updateRecord(@PathVariable Long id, @Valid @RequestBody EnergyDataDTO dto) {
        EnergyDataDTO updated = energyService.updateRecord(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteRecord(@PathVariable Long id) {
        energyService.deleteRecord(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Energy record with ID " + id + " was deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/devices")
    public ResponseEntity<List<String>> getDistinctDevices() {
        return ResponseEntity.ok(energyService.getDistinctDevices());
    }

    @GetMapping("/floors")
    public ResponseEntity<List<Integer>> getDistinctFloors() {
        return ResponseEntity.ok(energyService.getDistinctFloors());
    }
}
