package com.smartenergy.service;

import com.smartenergy.dto.EnergyDataDTO;
import com.smartenergy.exception.ResourceNotFoundException;
import com.smartenergy.model.EnergyData;
import com.smartenergy.repository.EnergyDataRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnergyService {

    private final EnergyDataRepository energyRepository;

    @Autowired
    public EnergyService(EnergyDataRepository energyRepository) {
        this.energyRepository = energyRepository;
    }

    public Page<EnergyDataDTO> getEnergyRecords(String device, Integer floor, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return energyRepository.findWithFilters(device, floor, startDate, endDate, pageable)
                .map(this::mapToDTO);
    }

    public List<EnergyDataDTO> getAllRecordsInRange(LocalDate startDate, LocalDate endDate) {
        return energyRepository.findByDateBetween(startDate, endDate)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public EnergyDataDTO getRecordById(Long id) {
        EnergyData data = energyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Energy record not found with id: " + id));
        return mapToDTO(data);
    }

    @Transactional
    public EnergyDataDTO createRecord(EnergyDataDTO dto) {
        EnergyData data = new EnergyData();
        data.setDeviceName(dto.getDeviceName());
        data.setFloorNumber(dto.getFloorNumber());
        data.setConsumption(dto.getConsumption());
        data.setOperatingHours(dto.getOperatingHours());
        data.setDate(dto.getDate());

        EnergyData saved = energyRepository.save(data);
        return mapToDTO(saved);
    }

    @Transactional
    public EnergyDataDTO updateRecord(Long id, EnergyDataDTO dto) {
        EnergyData data = energyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Energy record not found with id: " + id));

        data.setDeviceName(dto.getDeviceName());
        data.setFloorNumber(dto.getFloorNumber());
        data.setConsumption(dto.getConsumption());
        data.setOperatingHours(dto.getOperatingHours());
        data.setDate(dto.getDate());

        EnergyData updated = energyRepository.save(data);
        return mapToDTO(updated);
    }

    @Transactional
    public void deleteRecord(Long id) {
        EnergyData data = energyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Energy record not found with id: " + id));
        energyRepository.delete(data);
    }

    public List<String> getDistinctDevices() {
        return energyRepository.findDistinctDeviceNames();
    }

    public List<Integer> getDistinctFloors() {
        return energyRepository.findDistinctFloorNumbers();
    }

    private EnergyDataDTO mapToDTO(EnergyData entity) {
        return new EnergyDataDTO(
                entity.getId(),
                entity.getDeviceName(),
                entity.getFloorNumber(),
                entity.getConsumption(),
                entity.getOperatingHours(),
                entity.getDate()
        );
    }
}
