package com.M2I.TDClassroom.service;

import com.M2I.TDClassroom.model.Personne;
import com.M2I.TDClassroom.model.Role;
import com.M2I.TDClassroom.repository.PersonneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    private final PersonneRepository personneRepository;

    @Autowired
    public CustomUserDetailsService(PersonneRepository personneRepository) {
        this.personneRepository = personneRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.info("Loading user by email: {}", email); // Log the email
        Personne personne = personneRepository.findByEmail(email)
                .orElseThrow(() -> {
                    logger.error("User not found with email: {}", email); // Log the error
                    return new UsernameNotFoundException("User not found with email: " + email);
                });

        // Map roles to Spring Security's expected format (ROLE_ prefix)
        String[] roles = personne.getRoles().stream()
                .map(role -> "ROLE_" + role.getRoleNom())
                .toArray(String[]::new);

        logger.info("User found: {}", personne.getEmail()); // Log the user
        return User.builder()
                .username(personne.getEmail())
                .password(personne.getMotDePasse())
                .roles(roles) // Use the mapped roles
                .build();
    }
}