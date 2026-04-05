package com.freelanceiq.service;

import com.freelanceiq.model.*;
import com.freelanceiq.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import com.freelanceiq.exception.ResourceNotFoundException;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ClientRepository clientRepository;

    public List<Invoice> getAllInvoices() {
        return invoiceRepository.findAll();
    }

    public Invoice getInvoiceById(Long id) {
        return invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice not found with id: " + id));
    }

    public List<Invoice> getInvoicesByStatus(InvoiceStatus status) {
        return invoiceRepository.findByStatus(status);
    }

    @Transactional
    public Invoice generateInvoice(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found with id: " + projectId));

        Invoice invoice = new Invoice();
        invoice.setProject(project);
        invoice.setTotalAmount(project.getTotalHoursLogged() * project.getHourlyRate());
        invoice.setStatus(InvoiceStatus.UNPAID);
        return invoiceRepository.save(invoice);
    }

    @Transactional
    public Invoice markAsPaid(Long id) {
        Invoice invoice = getInvoiceById(id);
        invoice.setStatus(InvoiceStatus.PAID);
        invoice.setPaidAt(LocalDateTime.now());
        Invoice saved = invoiceRepository.save(invoice);
        updateClientHealthScore(invoice.getProject().getClient().getId());
        return saved;
    }

    private void updateClientHealthScore(Long clientId) {
        List<Invoice> paidInvoices = invoiceRepository.findByStatus(InvoiceStatus.PAID);

        double avgDays = paidInvoices.stream()
                .filter(inv -> inv.getProject().getClient().getId().equals(clientId))
                .filter(inv -> inv.getPaidAt() != null)
                .mapToLong(inv -> ChronoUnit.DAYS.between(inv.getIssuedAt(), inv.getPaidAt()))
                .average()
                .orElse(0.0);

        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found"));
        client.setClientHealthScore(avgDays);
        clientRepository.save(client);
    }
}