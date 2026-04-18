package com.freelanceiq.service;

import com.freelanceiq.exception.ResourceNotFoundException;
import com.freelanceiq.model.*;
import com.freelanceiq.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private TimeLogRepository timeLogRepository;

    @Autowired
    private InvoiceService invoiceService;

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + id));
    }

    public List<Project> getProjectsByClientId(Long clientId) {
        return projectRepository.findByClient_Id(clientId);
    }

    public List<Project> getAtRiskProjects() {
        return projectRepository.findByAtRiskTrue();
    }

    @Transactional
    public Project createProject(Long clientId, Project project) {
        if (project.getDeadline().isBefore(LocalDate.now())) {
            throw new RuntimeException("Deadline cannot be in the past");
        }
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with id: " + clientId));
        project.setClient(client);
        project.setStatus(ProjectStatus.ACTIVE);
        project.setTotalHoursLogged(0.0);
        project.setAtRisk(false);
        return projectRepository.save(project);
    }

    @Transactional
    public Project updateProject(Long id, Project updatedProject) {
        Project existing = getProjectById(id);
        existing.setTitle(updatedProject.getTitle());
        existing.setDescription(updatedProject.getDescription());
        existing.setTechStack(updatedProject.getTechStack());
        existing.setComplexity(updatedProject.getComplexity());
        existing.setHourlyRate(updatedProject.getHourlyRate());
        existing.setDeadline(updatedProject.getDeadline());

        if (updatedProject.getDeadline() != null
                && !updatedProject.getDeadline().isBefore(LocalDate.now())
                && existing.getStatus() == ProjectStatus.OVERDUE) {
            existing.setStatus(ProjectStatus.ACTIVE);
        }

        if (existing.getStatus() == ProjectStatus.ACTIVE && updatedProject.getDeadline() != null) {
            long daysUntilDeadline = ChronoUnit.DAYS.between(LocalDate.now(), updatedProject.getDeadline());
            Double totalHours = timeLogRepository.sumHoursByProjectId(id);
            if (totalHours == null) totalHours = 0.0;
            boolean atRisk = daysUntilDeadline >= 0 && daysUntilDeadline <= 3 && totalHours < 10;
            existing.setAtRisk(atRisk);
        }

        return projectRepository.save(existing);
    }

    @Transactional
    public void recalculateProjectStats(Long projectId) {
        Project project = getProjectById(projectId);

        Double totalHours = timeLogRepository.sumHoursByProjectId(projectId);
        if (totalHours == null) totalHours = 0.0;
        project.setTotalHoursLogged(totalHours);

        boolean atRisk = false;
        if (project.getDeadline() != null) {
            long daysUntilDeadline = ChronoUnit.DAYS.between(LocalDate.now(), project.getDeadline());
            atRisk = daysUntilDeadline <= 3 && totalHours < 10;
        }

        if (project.getDeadline() != null
                && project.getDeadline().isBefore(LocalDate.now())
                && project.getStatus() == ProjectStatus.ACTIVE) {
            project.setStatus(ProjectStatus.OVERDUE);
        }
        project.setAtRisk(atRisk);

        projectRepository.save(project);
    }

    @Transactional
    public Project completeProject(Long id) {
        Project project = getProjectById(id);
        project.setStatus(ProjectStatus.COMPLETED);
        projectRepository.save(project);
        invoiceService.generateInvoice(id);  // add this line
        return project;
    }

    public void deleteProject(Long id) {
        getProjectById(id);
        projectRepository.deleteById(id);
    }
}