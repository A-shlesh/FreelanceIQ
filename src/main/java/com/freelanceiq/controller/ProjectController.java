package com.freelanceiq.controller;

import com.freelanceiq.model.Project;
import com.freelanceiq.service.ProjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/projects")

public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Project>> getProjectsByClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(projectService.getProjectsByClientId(clientId));
    }

    @GetMapping("/at-risk")
    public ResponseEntity<List<Project>> getAtRiskProjects() {
        return ResponseEntity.ok(projectService.getAtRiskProjects());
    }

    @PostMapping
    public ResponseEntity<Project> createProject(
            @RequestParam Long clientId,
            @RequestBody Project project) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(projectService.createProject(clientId, project));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(
            @PathVariable Long id,
            @RequestBody Project project) {
        return ResponseEntity.ok(projectService.updateProject(id, project));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Project> completeProject(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.completeProject(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        projectService.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}

