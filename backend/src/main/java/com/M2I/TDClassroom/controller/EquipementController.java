package com.M2I.TDClassroom.controller;


import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.M2I.TDClassroom.dto.EquipementDto;
import com.M2I.TDClassroom.service.EquipementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipements")
@CrossOrigin(origins = "http://localhost:4201, allowedHeaders = \"*\", allowCredentials = \"true\")")  // Add this for Angular
public class EquipementController {

    @Autowired
    private EquipementService equipementService;

    // Get all equipment
    @GetMapping
    public ResponseEntity<List<EquipementDto>> getAllEquipements() {
        List<EquipementDto> equipements = equipementService.getAllEquipements();
        return new ResponseEntity<>(equipements, HttpStatus.OK);
    }

    // Get equipment by ID
    @GetMapping("/{id}")
    public ResponseEntity<EquipementDto> getEquipementById(@PathVariable Long id) {
        EquipementDto equipement = equipementService.getEquipementById(id);
        return new ResponseEntity<>(equipement, HttpStatus.OK);
    }

    // Create a new equipment
    @PostMapping
    public ResponseEntity<EquipementDto> createEquipement(@RequestBody EquipementDto equipementDto) {
        EquipementDto createdEquipement = equipementService.createEquipement(equipementDto);
        return new ResponseEntity<>(createdEquipement, HttpStatus.CREATED);
    }

    // Update an existing equipment
    @PutMapping("/{id}")
    public ResponseEntity<EquipementDto> updateEquipement(
            @PathVariable Long id,
            @RequestBody EquipementDto equipementDto) {
        EquipementDto updatedEquipement = equipementService.updateEquipement(id, equipementDto);
        return new ResponseEntity<>(updatedEquipement, HttpStatus.OK);
    }

    // Delete equipment by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipement(@PathVariable Long id) {
        equipementService.deleteEquipement(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
