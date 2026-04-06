package com.freelanceiq.controller;

import com.freelanceiq.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    @Autowired
    private AiService aiService;

    @PostMapping("/suggest-price")
    public ResponseEntity<String> suggestPrice(@RequestBody Map<String, String> projectDetails) {
        String suggestion = aiService.suggestPrice(projectDetails);
        return ResponseEntity.ok(suggestion);
    }
}
