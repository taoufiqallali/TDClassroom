package com.M2I.TDClassroom.controller;

import com.M2I.TDClassroom.dto.LocalDto;
import com.M2I.TDClassroom.model.Local;
import com.M2I.TDClassroom.service.LocalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locals")
@CrossOrigin(origins = "http://localhost:4201, allowedHeaders = \"*\", allowCredentials = \"true\")")  // Add this for Angular
public class LocalController {

    private final LocalService localService;


    @Autowired
    public LocalController(LocalService localService) {
        this.localService = localService;
    }

    @PostMapping
    public ResponseEntity<String> addLocal(@RequestBody Local local) {
        localService.createLocal(local);
        return ResponseEntity.ok("Local added successfully");
    }

    @GetMapping
    public ResponseEntity<List<LocalDto>> getAllLocals() {
        return ResponseEntity.ok(localService.getAllLocals());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LocalDto> getLocalById(@PathVariable Long id) {
        return ResponseEntity.ok(localService.getLocalById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateLocal(@PathVariable Long id, @RequestBody Local local) {
        localService.updateLocal(id, local);
        return ResponseEntity.ok("Local updated successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLocal(@PathVariable Long id) {
        localService.deleteLocal(id);
        return ResponseEntity.ok("Local deleted successfully");
    }

    @DeleteMapping("/delete-all")
    public ResponseEntity<String> deleteAllLocals(){
        localService.deleteAllLocals();
        return ResponseEntity.ok("all locals deleted successfully");
    }
}
