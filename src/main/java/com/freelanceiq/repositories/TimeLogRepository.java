package com.freelanceiq.repositories;

import com.freelanceiq.model.TimeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TimeLogRepository extends JpaRepository<TimeLog, Long> {

    List<TimeLog> findByProject_Id(Long projectId);

    @Query("SELECT SUM(t.hoursWorked) FROM TimeLog t WHERE t.project.id = ?1")
    Double sumHoursByProjectId(Long projectId);
}