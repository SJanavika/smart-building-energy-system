package com.smartenergy.repository;

import com.smartenergy.model.EnergyData;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EnergyDataRepository extends JpaRepository<EnergyData, Long> {

    @Query("SELECT e FROM EnergyData e WHERE " +
           "(:device IS NULL OR LOWER(e.deviceName) LIKE LOWER(CONCAT('%', :device, '%'))) AND " +
           "(:floor IS NULL OR e.floorNumber = :floor) AND " +
           "(:startDate IS NULL OR e.date >= :startDate) AND " +
           "(:endDate IS NULL OR e.date <= :endDate) " +
           "ORDER BY e.date DESC, e.id DESC")
    Page<EnergyData> findWithFilters(
            @Param("device") String device,
            @Param("floor") Integer floor,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );

    @Query("SELECT e FROM EnergyData e WHERE " +
           "(:startDate IS NULL OR e.date >= :startDate) AND " +
           "(:endDate IS NULL OR e.date <= :endDate) " +
           "ORDER BY e.date ASC")
    List<EnergyData> findByDateBetween(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

    @Query("SELECT COALESCE(SUM(e.consumption), 0.0) FROM EnergyData e")
    Double getTotalConsumption();

    @Query("SELECT COALESCE(SUM(e.consumption), 0.0) FROM EnergyData e WHERE e.date BETWEEN :startDate AND :endDate")
    Double getTotalConsumptionBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT e.deviceName, SUM(e.consumption) as totalKwh FROM EnergyData e GROUP BY e.deviceName ORDER BY totalKwh DESC")
    List<Object[]> getDeviceConsumptionBreakdown();

    @Query("SELECT e.date, SUM(e.consumption) FROM EnergyData e WHERE e.date >= :startDate GROUP BY e.date ORDER BY e.date ASC")
    List<Object[]> getDailyTrendsSince(@Param("startDate") LocalDate startDate);

    @Query("SELECT DISTINCT e.deviceName FROM EnergyData e ORDER BY e.deviceName ASC")
    List<String> findDistinctDeviceNames();

    @Query("SELECT DISTINCT e.floorNumber FROM EnergyData e ORDER BY e.floorNumber ASC")
    List<Integer> findDistinctFloorNumbers();

    @Query("SELECT e.deviceName, SUM(e.consumption) as sumKwh FROM EnergyData e GROUP BY e.deviceName ORDER BY sumKwh DESC LIMIT 1")
    List<Object[]> findTopConsumingDevice();
}
