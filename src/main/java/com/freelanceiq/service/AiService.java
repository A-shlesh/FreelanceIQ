package com.freelanceiq.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;
import java.util.Map;


@Service
public class AiService {

    @Value("${claude.api.key}")
    private String apiKey;

    @Value("${claude.api.url}")
    private String apiUrl;

    private final RestClient restClient = RestClient.create();

    public String suggestPrice(Map<String, String> projectDetails) {

        String prompt = String.format("""
                You are an expert freelance pricing consultant.
                Based on the following project details, suggest an appropriate hourly rate and total project price.
                
                Project Title: %s
                Tech Stack: %s
                Complexity: %s
                Deadline: %s
                Current Hourly Rate: %s
                
                Please provide:
                1. Recommended hourly rate (in USD)
                2. Estimated total project cost
                3. Brief reasoning for your suggestion
                Keep your response concise and practical.
                """,
                projectDetails.getOrDefault("title", "N/A"),
                projectDetails.getOrDefault("techStack", "N/A"),
                projectDetails.getOrDefault("complexity", "N/A"),
                projectDetails.getOrDefault("deadline", "N/A"),
                projectDetails.getOrDefault("hourlyRate", "N/A")
        );

        Map<String, Object> requestBody = Map.of(
                "model", "claude-sonnet-4-20250514",
                "max_tokens", 1024,
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                )
        );

        Map response = restClient.post()
                .uri(apiUrl)
                .header("x-api-key", apiKey)
                .header("anthropic-version", "2023-06-01")
                .header("Content-Type", "application/json")
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        List<Map<String, Object>> content = (List<Map<String, Object>>) response.get("content");
        return (String) content.get(0).get("text");
    }
}
