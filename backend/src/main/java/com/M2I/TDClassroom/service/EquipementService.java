package com.M2I.TDClassroom.service;

import com.M2I.TDClassroom.dto.EquipementDto;
import com.M2I.TDClassroom.model.Equipement;
import com.M2I.TDClassroom.repository.EquipementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EquipementService {

    @Autowired
    private EquipementRepository equipementRepository;

    // Get all equipment
    public List<EquipementDto> getAllEquipements() {
        return equipementRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Get equipment by ID
    public EquipementDto getEquipementById(Long id) {
        Equipement equipement = equipementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipement not found"));
        return mapToDto(equipement);
    }

    // Create a new equipment
    public EquipementDto createEquipement(EquipementDto equipementDto) {
        Equipement equipement = mapToEntity(equipementDto);
        Equipement savedEquipement = equipementRepository.save(equipement);
        return mapToDto(savedEquipement);
    }

    // Update an existing equipment
    public EquipementDto updateEquipement(Long id, EquipementDto equipementDto) {
        Equipement equipement = equipementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipement not found"));

        equipement.setName(equipementDto.getName());
        equipement.setDescription(equipementDto.getDescription());

        Equipement updatedEquipement = equipementRepository.save(equipement);
        return mapToDto(updatedEquipement);
    }

    // Delete equipment by ID
    public void deleteEquipement(Long id) {
        if (equipementRepository.existsById(id)) {
            equipementRepository.deleteById(id);
        } else {
            throw new RuntimeException("Equipement not found with id: " + id);
        }
    }

    // Convert Equipement to EquipementDto
    private EquipementDto mapToDto(Equipement equipement) {
        return new EquipementDto(
                equipement.getIdEquipement(),
                equipement.getName(),
                equipement.getDescription()
        );
    }

    // Convert EquipementDto to Equipement
    private Equipement mapToEntity(EquipementDto equipementDto) {
        return new Equipement(
                equipementDto.getIdEquipement(),
                equipementDto.getName(),
                equipementDto.getDescription()
        );
    }
}
