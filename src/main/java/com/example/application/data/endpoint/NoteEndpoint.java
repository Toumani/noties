package com.example.application.data.endpoint;

import com.example.application.data.entity.Note;
import com.example.application.data.service.NoteRepository;
import com.vaadin.flow.server.connect.Endpoint;

import javax.annotation.security.PermitAll;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Endpoint
@PermitAll
public class NoteEndpoint {
    private NoteRepository repository;

    public NoteEndpoint(NoteRepository repository) {
        this.repository = repository;
    }

    public List<Note> findAll() { return repository.findAll(); }

    public Optional<Note> findById(int id) {
        return repository.findById(id);
    }

    public Note save(Note note) {
        note.setCreate(LocalDate.now());
        return repository.save(note);
    }
}
