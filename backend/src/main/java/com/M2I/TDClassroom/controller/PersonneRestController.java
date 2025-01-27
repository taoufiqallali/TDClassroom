package com.M2I.TDClassroom.controller;

import com.M2I.TDClassroom.model.Personne;
import com.M2I.TDClassroom.repository.PersonneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class PersonneRestController {

    @Autowired
    private  PersonneRepository personneRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


    @PostMapping("/add")
    public Personne addPersonne(@RequestBody Personne personne) {
        personne.setMotDePasse(passwordEncoder.encode(personne.getMotDePasse()));
        return personneRepository.save(personne);
    }
}
