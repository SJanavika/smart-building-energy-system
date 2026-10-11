package com.smartenergy.service;

import com.smartenergy.dto.PredictionRequestDTO;
import com.smartenergy.dto.PredictionResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;

@Service
public class PredictionService {

    private static final Logger logger = LoggerFactory.getLogger(PredictionService.class);

    @Value("${ai.service.base-url}")
    private String aiServiceBaseUrl;

    @Value("${ai.service.predict-endpoint}")
    private String predictEndpoint;

    @Value("${energy.tariff.rate-per-kwh:8.0}")
    private Double defaultTariffRate;

    private final RestTemplate restTemplate;

    @Autowired
    public PredictionService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public PredictionResponseDTO predictEnergy(PredictionRequestDTO request) {
        Double rate = request.getElectricityRate() != null && request.getElectricityRate() > 0
                ? request.getElectricityRate()
                : defaultTariffRate;

        Double predictedUsage;

        try {
            String url = aiServiceBaseUrl + predictEndpoint;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> payload = new HashMap<>();
            payload.put("temperature", request.getTemperature());
            payload.put("humidity", request.getHumidity());
            payload.put("occupancy", request.getOccupancy());
            payload.put("hour", request.getHour());

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Object usageObj = response.getBody().get("predictedUsage");
                if (usageObj instanceof Number) {
                    predictedUsage = ((Number) usageObj).doubleValue();
                } else {
                    predictedUsage = Double.parseDouble(usageObj.toString());
                }
            } else {
                logger.warn("AI service returned non-OK status. Falling back to heuristic model.");
                predictedUsage = calculateFallbackPrediction(request);
            }
        } catch (Exception ex) {
            logger.warn("Could not connect to FastAPI AI Service at {}. Falling back to thermodynamic heuristic: {}",
                    aiServiceBaseUrl, ex.getMessage());
            predictedUsage = calculateFallbackPrediction(request);
        }

        // Round predicted usage to 2 decimal places
        predictedUsage = round(predictedUsage, 2);

        // Formula: Estimated Cost = Predicted Usage × Electricity Rate
        Double estimatedCost = round(predictedUsage * rate, 2);
        String formula = String.format("%.2f kWh × ₹%.2f = ₹%.2f", predictedUsage, rate, estimatedCost);

        return new PredictionResponseDTO(predictedUsage, rate, estimatedCost, formula);
    }

    /**
     * Fallback thermodynamic calculation if the AI python microservice is offline
     */
    private Double calculateFallbackPrediction(PredictionRequestDTO req) {
        double base = 25.0; // Server rooms, standby
        double hvac = Math.max(0.0, req.getTemperature() - 22.0) * 4.2 + (Math.max(0.0, req.getHumidity() - 50.0) * 0.4);
        if (req.getHour() >= 8 && req.getHour() <= 19 && req.getOccupancy() > 10) {
            hvac *= 1.45;
        } else {
            hvac *= 0.45;
        }
        double plug = req.getOccupancy() * 0.38;
        double lighting = (req.getHour() >= 8 && req.getHour() <= 19) ? (18.0 * (req.getOccupancy() / 200.0) + 4.0) : 4.0;
        return Math.max(15.0, base + hvac + plug + lighting);
    }

    private Double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();
        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}
