package com.speechtotext.service;

import com.speechtotext.dto.TranscriptionRequest;
import com.speechtotext.model.Transcription;
import com.speechtotext.repository.TranscriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class TranscriptionService {

    private final TranscriptionRepository repository;

    public TranscriptionService(TranscriptionRepository repository) {
        this.repository = repository;
    }

    public List<Transcription> findAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public Transcription findById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transcription not found with id: " + id));
    }

    public Transcription create(TranscriptionRequest request) {
        Transcription transcription = new Transcription();
        transcription.setText(request.getText());
        transcription.setLanguage(request.getLanguage());
        transcription.setConfidenceScore(request.getConfidenceScore());
        return repository.save(transcription);
    }

    public Transcription update(Long id, TranscriptionRequest request) {
        Transcription existing = findById(id);
        existing.setText(request.getText());
        if (request.getLanguage() != null) {
            existing.setLanguage(request.getLanguage());
        }
        if (request.getConfidenceScore() != null) {
            existing.setConfidenceScore(request.getConfidenceScore());
        }
        return repository.save(existing);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Transcription not found with id: " + id);
        }
        repository.deleteById(id);
    }
}
