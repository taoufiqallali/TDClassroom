package com.M2I.TDClassroom.controller;



import com.M2I.TDClassroom.model.Equipement;
import com.M2I.TDClassroom.service.EquipementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4201, allowedHeaders = \"*\", allowCredentials = \"true\")")  // Add this for Angular
@RestController
@RequestMapping("/api/equipements")
public class EquipementController {

    private final EquipementService equipementService;

    @Autowired
    public EquipementController(EquipementService equipementService){
        this.equipementService = equipementService;
    }

    @GetMapping
    public List<Equipement> getAllEquipements(){

        return equipementService.getAllEquipement();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipement> getEquipementById(@PathVariable Long id) {
        Optional<Equipement> equipement = equipementService.getEquipementById(id);
        return equipement.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Equipement createEquipement(@RequestBody Equipement equipement) {
        return equipementService.createEquipement(equipement);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipement> updateEquipement(@PathVariable Long id, @RequestBody Equipement equipementDetails) {
        try {
            Equipement updatedEquipement = equipementService.updateEquipement(id, equipementDetails);
            return ResponseEntity.ok(updatedEquipement);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEquipement(@PathVariable Long id) {
        equipementService.deleteEquipement(id);
        return ResponseEntity.noContent().build();
    }
}
