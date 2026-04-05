package com.freelanceiq.controller;

import com.freelanceiq.model.TimeLog;
import com.freelanceiq.service.TimeLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/timelogs")
public class TimeLogController {
    @Autowired
    private TimeLogService timeLogService;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TimeLog>> getTimeLogsByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(timeLogService.getTimeLogsByProjectId(projectId));
    }

    @PostMapping
    public ResponseEntity<TimeLog> addTimeLog(
            @RequestParam Long projectId,
            @RequestBody TimeLog timeLog) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(timeLogService.addTimeLog(projectId, timeLog));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTimeLog(@PathVariable Long id) {
        timeLogService.deleteTimeLog(id);
        return ResponseEntity.noContent().build();
    }
}