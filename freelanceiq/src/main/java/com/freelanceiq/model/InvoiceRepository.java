package com.freelanceiq.model;

import com.freelanceiq.model.Invoice;
import com.freelanceiq.model.InvoiceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {

    List<Invoice> findByStatus(InvoiceStatus status);

    Optional<Invoice> findByProject_Id(Long projectId);
}