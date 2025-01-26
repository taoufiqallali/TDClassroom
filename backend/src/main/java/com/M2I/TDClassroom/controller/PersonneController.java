package com.M2I.TDClassroom.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PersonneController {


    @GetMapping("/personne")
    public String personne(){

        return "forward:personne.html";

    }

}
