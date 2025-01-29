package com.M2I.TDClassroom.controller;

import com.M2I.TDClassroom.dto.PersonneDto;
import com.M2I.TDClassroom.model.Personne;
import com.M2I.TDClassroom.service.PersonneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personnes")
public class PersonneController {

    @Autowired
    private PersonneService personneService;

    // Get all users
    @GetMapping
    public ResponseEntity<List<PersonneDto>> getAllPersonnes() {
        return ResponseEntity.ok(personneService.getAllPersonnes());
    }

    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<PersonneDto> getPersonneById(@PathVariable Long id) {
        return ResponseEntity.ok(personneService.getPersonneById(id));
    }

    // Create a new user
    @PostMapping
    public ResponseEntity<String> createPersonne(@RequestBody Personne personne) {
        personneService.savePersonne(personne);
        return ResponseEntity.ok("User created successfully");
    }

    // Update an existing user
    @PutMapping("/{id}")
    public ResponseEntity<String> updatePersonne(@PathVariable Long id, @RequestBody Personne personne) {
        personneService.updatePersonne(id, personne);
        return ResponseEntity.ok("User updated successfully");
    }

    // Delete a user by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePersonne(@PathVariable Long id) {
        personneService.deletePersonne(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    // Delete all users
    @DeleteMapping("/delete-all")
    public ResponseEntity<String> deleteAllPersonnes() {
        personneService.deleteAllPersonnes();
        return ResponseEntity.ok("All users deleted successfully.");
    }
}
