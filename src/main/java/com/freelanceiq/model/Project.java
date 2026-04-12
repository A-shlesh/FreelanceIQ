package com.freelanceiq.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name="projects")

public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String techStack;

    @Enumerated(EnumType.STRING)
    private Complexity complexity;


    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    private Double hourlyRate;
    private LocalDate deadline;
    private Double totalHoursLogged;
    private Boolean atRisk;

    @Transient
    private String clientName;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id")
    private Client client;

    @JsonIgnore
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<TimeLog> timeLogs;

    @JsonIgnore
    @OneToOne(mappedBy = "project", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Invoice invoice;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getClientName() {
        return client != null ? client.getName() : null;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTechStack() { return techStack; }
    public void setTechStack(String techStack) { this.techStack = techStack; }

    public Complexity getComplexity() { return complexity; }
    public void setComplexity(Complexity complexity) { this.complexity = complexity; }

    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }

    public Double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public Double getTotalHoursLogged() { return totalHoursLogged; }
    public void setTotalHoursLogged(Double totalHoursLogged) { this.totalHoursLogged = totalHoursLogged; }

    public Boolean getAtRisk() { return atRisk; }
    public void setAtRisk(Boolean atRisk) { this.atRisk = atRisk; }

    public Client getClient() { return client; }
    public void setClient(Client client) { this.client = client; }

    public List<TimeLog> getTimeLogs() { return timeLogs; }
    public void setTimeLogs(List<TimeLog> timeLogs) { this.timeLogs = timeLogs; }

    public Invoice getInvoice() { return invoice; }
    public void setInvoice(Invoice invoice) { this.invoice = invoice; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
