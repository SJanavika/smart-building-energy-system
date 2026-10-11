package com.smartenergy.service;

import com.smartenergy.dto.RecommendationDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class RecommendationService {

    private static final Logger logger = LoggerFactory.getLogger(RecommendationService.class);

    @Value("${ai.service.base-url}")
    private String aiServiceBaseUrl;

    @Value("${ai.service.recommendations-endpoint:/recommendations}")
    private String recommendationsEndpoint;

    @Value("${energy.tariff.rate-per-kwh:8.0}")
    private Double tariffRate;

    private final RestTemplate restTemplate;

    @Autowired
    public RecommendationService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<RecommendationDTO> getRecommendations(Integer occupancy, Double currentUsage, Integer hour) {
        try {
            String url = aiServiceBaseUrl + recommendationsEndpoint;

            Map<String, Object> payload = new HashMap<>();
            payload.put("occupancy", occupancy != null ? occupancy : 45);
            payload.put("currentUsage", currentUsage != null ? currentUsage : 160.0);
            payload.put("hour", hour != null ? hour : 14);
            payload.put("ratePerKwh", tariffRate);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> rawList = (List<Map<String, Object>>) response.getBody().get("recommendations");
                if (rawList != null && !rawList.isEmpty()) {
                    List<RecommendationDTO> dtos = new ArrayList<>();
                    for (Map<String, Object> r : rawList) {
                        dtos.add(new RecommendationDTO(
                                (String) r.get("id"),
                                (String) r.get("category"),
                                (String) r.get("title"),
                                (String) r.get("description"),
                                (String) r.get("priority"),
                                ((Number) r.get("estimatedSavingsKwh")).doubleValue(),
                                ((Number) r.get("estimatedSavingsCost")).doubleValue()
                        ));
                    }
                    return dtos;
                }
            }
        } catch (Exception ex) {
            logger.warn("FastAPI recommendations unavailable, executing built-in rule engine: {}", ex.getMessage());
        }

        return generateFallbackRecommendations(occupancy, currentUsage, hour);
    }

    private List<RecommendationDTO> generateFallbackRecommendations(Integer occupancy, Double currentUsage, Integer hour) {
        int occ = occupancy != null ? occupancy : 35;
        double usage = currentUsage != null ? currentUsage : 145.0;
        int hr = hour != null ? hour : 15;

        List<RecommendationDTO> list = new ArrayList<>();

        // Rule 1: Low occupancy vs High AC/Usage
        if (occ < 40 && usage > 90.0) {
            double savingsKwh = Math.round(usage * 0.32 * 100.0) / 100.0;
            list.add(new RecommendationDTO(
                    "REC-001",
                    "HVAC Optimization",
                    "Reduce AC Operation During Low Occupancy Periods",
                    "Building occupancy is low (" + occ + " occupants) while HVAC energy consumption remains elevated. Increase zone thermostats to 25°C or activate setback mode.",
                    "HIGH",
                    savingsKwh,
                    Math.round(savingsKwh * tariffRate * 100.0) / 100.0
            ));
        }

        // Rule 2: Excessive lighting after working hours
        if (hr >= 19 || hr <= 6) {
            double savingsKwh = 24.5;
            list.add(new RecommendationDTO(
                    "REC-002",
                    "Lighting Control",
                    "Turn Off Unused Lights After Working Hours",
                    "After-hours operation detected at " + hr + ":00. Deactivate secondary floor illuminators and engage occupancy sensors across conference rooms.",
                    "HIGH",
                    savingsKwh,
                    Math.round(savingsKwh * tariffRate * 100.0) / 100.0
            ));
        }

        // Rule 3: Peak hour chiller staging
        if (hr >= 13 && hr <= 17) {
            double savingsKwh = 38.0;
            list.add(new RecommendationDTO(
                    "REC-003",
                    "Peak Shaving",
                    "Pre-Cooling & Chiller Staging for Peak Hours",
                    "Peak commercial grid pricing in effect. Ramp down auxiliary chillers and leverage thermal building mass.",
                    "MEDIUM",
                    savingsKwh,
                    Math.round(savingsKwh * tariffRate * 100.0) / 100.0
            ));
        }

        // Rule 4: Standby plug loads
        double plugSavings = 15.0;
        list.add(new RecommendationDTO(
                "REC-004",
                "Plug Load Management",
                "Activate Smart Power Strips for Workstations",
                "Turn off peripheral monitors, printers, and water dispensers overnight to mitigate vampire power draw.",
                "LOW",
                plugSavings,
                Math.round(plugSavings * tariffRate * 100.0) / 100.0
        ));

        return list;
    }
}
