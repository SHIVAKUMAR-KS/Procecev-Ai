package com.speechtotext.controller;

import com.speechtotext.dto.TranscriptionRequest;
import com.speechtotext.model.Transcription;
import com.speechtotext.service.TranscriptionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transcriptions")
@CrossOrigin(originPatterns = "*")
public class TranscriptionController {

    private final TranscriptionService service;

    public TranscriptionController(TranscriptionService service) {
        this.service = service;
    }

    @GetMapping
    public List<Transcription> getAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Transcription getById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<Transcription> create(@Valid @RequestBody TranscriptionRequest request) {
        Transcription saved = service.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    public Transcription update(@PathVariable Long id, @Valid @RequestBody TranscriptionRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable Long id) {
        service.delete(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Transcription deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "Speech to Text API");
        return status;
    }
}
