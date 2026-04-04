package com.freelanceiq.repositories;

import com.freelanceiq.model.Project;
import com.freelanceiq.model.ProjectStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findByClient_Id(Long clientId);

    List<Project> findByAtRiskTrue();

    List<Project> findByStatus(ProjectStatus status);
}