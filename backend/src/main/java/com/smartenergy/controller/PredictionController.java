package com.smartenergy.controller;

import com.smartenergy.dto.PredictionRequestDTO;
import com.smartenergy.dto.PredictionResponseDTO;
import com.smartenergy.dto.RecommendationDTO;
import com.smartenergy.service.PredictionService;
import com.smartenergy.service.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/prediction")
public class PredictionController {

    private final PredictionService predictionService;
    private final RecommendationService recommendationService;

    @Autowired
    public PredictionController(PredictionService predictionService, RecommendationService recommendationService) {
        this.predictionService = predictionService;
        this.recommendationService = recommendationService;
    }

    @PostMapping("/predict")
    public ResponseEntity<PredictionResponseDTO> predictEnergyConsumption(@Valid @RequestBody PredictionRequestDTO request) {
        PredictionResponseDTO response = predictionService.predictEnergy(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/cost-estimate")
    public ResponseEntity<PredictionResponseDTO> calculateCostEstimation(@Valid @RequestBody PredictionRequestDTO request) {
        PredictionResponseDTO response = predictionService.predictEnergy(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<RecommendationDTO>> getRecommendations(
            @RequestParam(required = false) Integer occupancy,
            @RequestParam(required = false) Double currentUsage,
            @RequestParam(required = false) Integer hour
    ) {
        List<RecommendationDTO> recommendations = recommendationService.getRecommendations(occupancy, currentUsage, hour);
        return ResponseEntity.ok(recommendations);
    }
}
