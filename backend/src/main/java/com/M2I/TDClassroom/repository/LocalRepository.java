package com.M2I.TDClassroom.repository;

import com.M2I.TDClassroom.model.Local;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LocalRepository extends JpaRepository<Local, Long> {

    List<Local> findAllByIdLocalNotIn(List<Long> reservedLocalIds);

}
