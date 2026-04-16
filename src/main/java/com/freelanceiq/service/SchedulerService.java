package com.freelanceiq.service;

import com.freelanceiq.model.Project;
import com.freelanceiq.model.ProjectStatus;
import com.freelanceiq.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class SchedulerService {

    @Autowired
    private ProjectRepository projectRepository;

    @EventListener(ApplicationReadyEvent.class)
    public void runOnStartup() {
        markOverdueProjects();
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void markOverdueProjects() {
        List<Project> projects = projectRepository.findAll();
        System.out.println("Scheduler running, total projects: " + projects.size());
        for (Project project : projects) {
            System.out.println("Checking: " + project.getTitle() + " | deadline: " + project.getDeadline() + " | status: " + project.getStatus());
            if (project.getDeadline() != null
                    && project.getDeadline().isBefore(LocalDate.now())
                    && project.getStatus() == ProjectStatus.ACTIVE) {
                project.setStatus(ProjectStatus.OVERDUE);
                projectRepository.save(project);
                System.out.println("Marked OVERDUE: " + project.getTitle());
            }
        }
    }
}