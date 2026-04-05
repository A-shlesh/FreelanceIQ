package com.freelanceiq.service;

import com.freelanceiq.exception.ResourceNotFoundException;
import com.freelanceiq.model.Project;
import com.freelanceiq.model.TimeLog;
import com.freelanceiq.repository.ProjectRepository;
import com.freelanceiq.repository.TimeLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class TimeLogService {

    @Autowired
    private TimeLogRepository timeLogRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectService projectService;

    public List<TimeLog> getTimeLogsByProjectId(Long projectId) {
        return timeLogRepository.findByProject_Id(projectId);
    }

    @Transactional
    public TimeLog addTimeLog(Long projectId, TimeLog timeLog) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));
        timeLog.setProject(project);
        TimeLog saved = timeLogRepository.save(timeLog);
        projectService.recalculateProjectStats(projectId);
        return saved;
    }

    @Transactional
    public void deleteTimeLog(Long id) {
        TimeLog timeLog = timeLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TimeLog not found with id: " + id));
        Long projectId = timeLog.getProject().getId();
        timeLogRepository.deleteById(id);
        projectService.recalculateProjectStats(projectId);
    }
}