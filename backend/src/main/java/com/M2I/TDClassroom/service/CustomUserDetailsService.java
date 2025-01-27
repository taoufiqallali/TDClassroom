package com.M2I.TDClassroom.service;

import com.M2I.TDClassroom.model.Personne;
import com.M2I.TDClassroom.repository.PersonneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    PersonneRepository personneRepository;


    @Override
    public UserDetails loadUserByUsername(String username){


        Optional<Personne> personneOptional = personneRepository.findByEmail(username);
        if(personneOptional.isPresent()){
            var personne = personneOptional.get();


            return User.builder()
                    .username(personne.getEmail())
                    .password(personne.getMotDePasse()) // Ensure this is a BCrypt-encoded password
                    .roles(personne.getRoles().stream().map(role -> role.getRoleNom().name()).toArray(String[]::new))
                    .build();

        }else{

            throw new UsernameNotFoundException(username);
        }
    }
}
