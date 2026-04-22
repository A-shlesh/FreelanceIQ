package com.freelanceiq.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
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
                1. Recommended hourly rate (in INR - Indian Rupees)
                2. Estimated total project cost (in INR)
                3. Brief reasoning for your suggestion
                Consider the Indian freelance market rates while suggesting.
                Keep your response concise and practical.
                """,
                projectDetails.getOrDefault("title", "N/A"),
                projectDetails.getOrDefault("techStack", "N/A"),
                projectDetails.getOrDefault("complexity", "N/A"),
                projectDetails.getOrDefault("deadline", "N/A"),
                projectDetails.getOrDefault("hourlyRate", "N/A")
        );

        Map<String, Object> requestBody = Map.of(
                "model", "llama-3.3-70b-versatile",
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                )
        );

        Map response = restClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .body(requestBody)
                .retrieve()
                .body(Map.class);

        List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
        return (String) message.get("content");
    }
}