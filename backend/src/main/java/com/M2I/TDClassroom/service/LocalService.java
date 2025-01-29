package com.M2I.TDClassroom.service;

import com.M2I.TDClassroom.model.Local;
import com.M2I.TDClassroom.repository.LocalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LocalService {
    private final LocalRepository localRepository;

    @Autowired
    public LocalService(LocalRepository localRepository) {
        this.localRepository = localRepository;
    }

    public List<Local> getAllLocals() {
        return localRepository.findAll();
    }

    public Local getLocalById(Long id) {
        Local local = localRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Local not found"));

        return local;
    }

    public Local createLocal(Local local) {
        return localRepository.save(local);
    }

    public Local updateLocal(Long id, Local updatedLocal) {
        return localRepository.findById(id).map(local -> {
            local.setIdUnite(updatedLocal.getIdUnite());
            local.setNom(updatedLocal.getNom());
            local.setCapacite(updatedLocal.getCapacite());
            local.setAccessibilitePmr(updatedLocal.getAccessibilitePmr());
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
}
