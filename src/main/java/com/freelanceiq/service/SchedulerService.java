package com.freelanceiq.service;

import com.freelanceiq.model.Project;
import com.freelanceiq.model.ProjectStatus;
import com.freelanceiq.repository.ProjectRepository;
import com.freelanceiq.repository.TimeLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class SchedulerService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TimeLogRepository timeLogRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void runOnStartup() {
        markOverdueProjects();
        recalculateAllProjectStats();
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void markOverdueProjects() {
        List<Project> projects = projectRepository.findAll();
        for (Project project : projects) {
            if (project.getDeadline() != null
                    && project.getDeadline().isBefore(LocalDate.now())
                    && project.getStatus() == ProjectStatus.ACTIVE) {
                project.setStatus(ProjectStatus.OVERDUE);
                project.setAtRisk(false);
                projectRepository.save(project);
            }
        }
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void recalculateAllProjectStats() {
        List<Project> projects = projectRepository.findAll();
        for (Project project : projects) {
            if (project.getStatus() != ProjectStatus.COMPLETED) {
                Double totalHours = timeLogRepository.sumHoursByProjectId(project.getId());
                if (totalHours == null) totalHours = 0.0;
                project.setTotalHoursLogged(totalHours);

                boolean atRisk = false;
                if (project.getDeadline() != null && project.getStatus() == ProjectStatus.ACTIVE) {
                    long daysUntilDeadline = ChronoUnit.DAYS.between(LocalDate.now(), project.getDeadline());
                    atRisk = daysUntilDeadline >= 0 && daysUntilDeadline <= 3 && totalHours < 10;
                }
                project.setAtRisk(atRisk);
                System.out.println("Recalculating stats for: " + project.getTitle() + " | daysUntilDeadline: " + ChronoUnit.DAYS.between(LocalDate.now(), project.getDeadline()) + " | atRisk: " + atRisk);
                projectRepository.save(project);
            }
        }
    }
}