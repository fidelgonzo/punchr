package com.punchr.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.punchr.domain.Timesheet;
import com.punchr.repository.TimesheetRepository;
import com.punchr.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;

import java.net.URI;
import java.net.URISyntaxException;

import javax.servlet.http.HttpServletResponse;

import java.util.List;

/**
 * REST controller for managing Timesheet.
 */
@RestController
@RequestMapping("/api")
public class TimesheetResource {

    private final Logger log = LoggerFactory.getLogger(TimesheetResource.class);

    @Inject
    private TimesheetRepository timesheetRepository;
    
    @Inject
    private UserService userService;

    /**
     * POST  /timesheets -> Create a new timesheet.
     */
    @RequestMapping(value = "/timesheets",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> create(@Valid @RequestBody Timesheet timesheet) throws URISyntaxException {
        log.debug("REST request to save Timesheet : {}", timesheet);
        if (timesheet.getId() != null) {
            return ResponseEntity.badRequest().header("Failure", "A new timesheet cannot already have an ID").build();
        }
        
        if(timesheet.getUserId() == null) {
        	timesheet.setUserId(userService.getUserWithAuthorities());
        }
        
        timesheetRepository.save(timesheet);
        return ResponseEntity.created(new URI("/api/timesheets/" + timesheet.getId())).build();
    }

    /**
     * PUT  /timesheets -> Updates an existing timesheet.
     */
    @RequestMapping(value = "/timesheets",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> update(@Valid @RequestBody Timesheet timesheet) throws URISyntaxException {
        log.debug("REST request to update Timesheet : {}", timesheet);
        if (timesheet.getId() == null) {
            return create(timesheet);
        }
        
        if(timesheet.getUserId() == null) {
        	timesheet.setUserId(userService.getUserWithAuthorities());
        }
        timesheetRepository.save(timesheet);
        return ResponseEntity.ok().build();
    }

    /**
     * GET  /timesheets -> get all the timesheets.
     */
    @RequestMapping(value = "/timesheets/all",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Timesheet> getAll() {
        log.debug("REST request to get all Timesheets");
        return timesheetRepository.findAll();
    }

    /**
     * GET  /timesheets/:id -> get the "id" timesheet.
     */
    @RequestMapping(value = "/timesheets/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Timesheet> get(@PathVariable Long id, HttpServletResponse response) {
        log.debug("REST request to get Timesheet : {}", id);
        Timesheet timesheet = timesheetRepository.findOne(id);
        if (timesheet == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(timesheet, HttpStatus.OK);
    }
    
    /**
     * GET  /timesheets/:id -> get the "id" timesheet.
     */
    @RequestMapping(value = "/timesheets",
    		method = RequestMethod.GET,
    		produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Timesheet> getByUser(HttpServletResponse response) {
    	log.debug("REST request to get all Timesheets by Logged User");
        return timesheetRepository.findAllForCurrentUser();
    }

    /**
     * DELETE  /timesheets/:id -> delete the "id" timesheet.
     */
    @RequestMapping(value = "/timesheets/{id}",
            method = RequestMethod.DELETE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public void delete(@PathVariable Long id) {
        log.debug("REST request to delete Timesheet : {}", id);
        timesheetRepository.delete(id);
    }
}
