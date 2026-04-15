package com.freelanceiq.service;

import com.freelanceiq.model.Project;
import com.freelanceiq.model.ProjectStatus;
import com.freelanceiq.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class SchedulerService {

    @Autowired
    private ProjectRepository projectRepository;

    @Scheduled(cron = "0 0 0 * * *")
    public void markOverdueProjects() {
        List<Project> projects = projectRepository.findAll();
        for (Project project : projects) {
            if (project.getDeadline() != null
                    && !project.getDeadline().isAfter(LocalDate.now().minusDays(1))
                    && project.getStatus() == ProjectStatus.ACTIVE) {
                project.setStatus(ProjectStatus.OVERDUE);
                projectRepository.save(project);
            }
        }
    }
}
