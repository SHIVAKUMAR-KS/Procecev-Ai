package com.speechtotext.repository;

import com.speechtotext.model.Transcription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TranscriptionRepository extends JpaRepository<Transcription, Long> {

    List<Transcription> findAllByOrderByCreatedAtDesc();
}
