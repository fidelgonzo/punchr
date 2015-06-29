package com.punchr.repository;

import com.punchr.domain.Timesheet;
import com.punchr.domain.User;

import org.springframework.data.jpa.repository.*;

import java.util.List;

import javax.transaction.Transactional;

/**
 * Spring Data JPA repository for the Timesheet entity.
 */
public interface TimesheetRepository extends JpaRepository<Timesheet,Long> {

    @Query("select timesheet from Timesheet timesheet where timesheet.userId.login = ?#{principal.username}")
    List<Timesheet> findAllForCurrentUser();
    
    @Transactional
    void deleteByUserId(User user);

}
