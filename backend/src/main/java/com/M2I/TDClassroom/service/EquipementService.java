package com.M2I.TDClassroom.service;


import com.M2I.TDClassroom.model.Equipement;
import com.M2I.TDClassroom.repository.EquipementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EquipementService {

    private final EquipementRepository equipementRepository;

    @Autowired
    public EquipementService(EquipementRepository equipementRepository){
        this.equipementRepository = equipementRepository;
    }

    public List<Equipement> getAllEquipement(){
        return equipementRepository.findAll();
    }

    public Optional<Equipement> getEquipementById(Long id){
        return equipementRepository.findById(id);
    }

    public Equipement createEquipement(Equipement equipement){
        return equipementRepository.save(equipement);
    }

    public Equipement updateEquipement(Long id, Equipement equipementDetails){
        return equipementRepository.findById(id)
                .map(equipement -> {
                    equipement.setName(equipementDetails.getName());
                    equipement.setDescription(equipementDetails.getDescription());
                    return equipementRepository.save(equipement);
                })
                .orElseThrow(() -> new RuntimeException("equipement not found"));
    }

    public  void deleteEquipement(Long id){
        equipementRepository.deleteById(id);
    }


}
