package com.M2I.TDClassroom.service;

import com.M2I.TDClassroom.model.Personne;
import com.M2I.TDClassroom.model.Role;
import com.M2I.TDClassroom.model.UniteOrganisation;
import com.M2I.TDClassroom.repository.PersonneRepository;
import com.M2I.TDClassroom.dto.PersonneDto;
import com.M2I.TDClassroom.repository.RoleRepository;
import com.M2I.TDClassroom.repository.UniteOrganisationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class PersonneService {

    @Autowired
    private PersonneRepository personneRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UniteOrganisationRepository uniteOrganisationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Get all users
    public List<PersonneDto> getAllPersonnes() {
        return personneRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Get a user by email
    public PersonneDto getPersonneByEmail(String email) {
        Personne personne = personneRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Personne not found"));
        return mapToDto(personne);
    }

    // Get a user by ID
    public PersonneDto getPersonneById(Long id) {
        Personne personne = personneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Personne not found"));
        return mapToDto(personne);
    }

    // Save a new user
    public void savePersonne(Personne personne) {

        personne.setMotDePasse(passwordEncoder.encode(personne.getMotDePasse()));
        personneRepository.save(personne);
    }

    // Update an existing user
    public void updatePersonne(Long id, Personne updatedPersonne) {
        Personne existingPersonne = personneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Personne not found"));

        existingPersonne.setNom(updatedPersonne.getNom());
        existingPersonne.setPrenom(updatedPersonne.getPrenom());
        existingPersonne.setDateNaissance(updatedPersonne.getDateNaissance());
        existingPersonne.setEmail(updatedPersonne.getEmail());
        existingPersonne.setCin(updatedPersonne.getCin());
        existingPersonne.setTel(updatedPersonne.getTel());
        existingPersonne.setGrade(updatedPersonne.getGrade());
        existingPersonne.setAddress(updatedPersonne.getAddress());
        existingPersonne.setVille(updatedPersonne.getVille());
        existingPersonne.setCodePostale(updatedPersonne.getCodePostale());
        existingPersonne.setResponsabilite(updatedPersonne.getResponsabilite());
        existingPersonne.setNomBanque(updatedPersonne.getNomBanque());
        existingPersonne.setSom(updatedPersonne.getSom());
        existingPersonne.setUniteOrganisation(updatedPersonne.getUniteOrganisation());
        existingPersonne.setRoles(updatedPersonne.getRoles());


        // Encode password only if it's changed
        if (!updatedPersonne.getMotDePasse().equals(existingPersonne.getMotDePasse())) {
            existingPersonne.setMotDePasse(passwordEncoder.encode(updatedPersonne.getMotDePasse()));
        }

        personneRepository.save(existingPersonne);
    }

    // Delete a user by ID
    public void deletePersonne(Long id) {
        personneRepository.deleteById(id);
    }

    // Delete all users
    public void deleteAllPersonnes() {
        personneRepository.deleteAll();
    }

    // Convert Personne to PersonneDto
    private PersonneDto mapToDto(Personne personne) {
        return new PersonneDto(
                personne.getPersonneId(),
                personne.getNom(),
                personne.getPrenom(),
                personne.getEmail(),
                personne.getTel(),
                personne.getGrade().name(),
                personne.getRoles() != null
                        ? personne.getRoles().stream()
                        .map(role -> role.getRoleNom().name())
                        .collect(Collectors.toSet())
                        : null
        );
    }
}
