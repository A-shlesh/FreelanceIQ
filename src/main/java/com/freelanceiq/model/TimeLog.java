package com.freelanceiq.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name="timelogs")

public class TimeLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double hoursWorked;
    private String workDescription;
    private LocalDate dateLogged;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getHoursWorked() { return hoursWorked; }
    public void setHoursWorked(Double hoursWorked) { this.hoursWorked = hoursWorked; }

    public String getWorkDescription() { return workDescription; }
    public void setWorkDescription(String workDescription) { this.workDescription = workDescription; }

    public LocalDate getDateLogged() { return dateLogged; }
    public void setDateLogged(LocalDate dateLogged) { this.dateLogged = dateLogged; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

}
