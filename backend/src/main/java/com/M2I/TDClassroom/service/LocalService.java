package com.M2I.TDClassroom.service;

import com.M2I.TDClassroom.dto.LocalDto;
import com.M2I.TDClassroom.model.Local;
import com.M2I.TDClassroom.repository.LocalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LocalService {
    private final LocalRepository localRepository;

    @Autowired
    public LocalService(LocalRepository localRepository) {
        this.localRepository = localRepository;
    }

    public List<LocalDto> getAllLocals() {
        return localRepository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public LocalDto getLocalById(Long id) {
        Local local = localRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Local not found"));

        return mapToDto(local);
    }

    public Local createLocal(Local local) {
        return localRepository.save(local);
    }

    public Local updateLocal(Long id, Local updatedLocal) {
        return localRepository.findById(id).map(local -> {
            local.setUniteOrganisation(updatedLocal.getUniteOrganisation());
            local.setNom(updatedLocal.getNom());
            local.setCapacite(updatedLocal.getCapacite());
            local.setAccessibilitePmr(updatedLocal.isAccessibilitePmr());
            local.setDatashow(updatedLocal.isDatashow());  // Set datashow
            local.setEcranTactile(updatedLocal.getEcranTactile());  // Set ecranTactile
            return localRepository.save(local);
        }).orElseThrow(() -> new RuntimeException("Local not found with id: " + id));
    }

    public void deleteLocal(Long id) {
        if (localRepository.existsById(id)) {
            localRepository.deleteById(id);
        } else {
            throw new RuntimeException("Local not found with id: " + id);
        }
    }

    public void deleteAllLocals() {
        localRepository.deleteAll();
    }

    public LocalDto mapToDto(Local local) {
        // Get the name of UniteOrganisation
        String uniteOrganisationNom = local.getUniteOrganisation().getNom().name();

        return new LocalDto(
                local.getIdLocal(),
                local.getNom(),
                local.getCapacite(),
                local.isAccessibilitePmr(),
                uniteOrganisationNom, // Only include the name
                local.isDatashow(), // Include datashow status
                local.getEcranTactile() // Include ecranTactile status (can be null)
        );
    }
}
