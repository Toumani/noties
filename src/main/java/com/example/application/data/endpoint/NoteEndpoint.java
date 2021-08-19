package com.example.application.data.endpoint;

import com.example.application.data.entity.Note;
import com.example.application.data.entity.Todo;
import com.example.application.data.service.NoteRepository;
import com.example.application.data.service.TodoRepository;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.flow.server.connect.Endpoint;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Endpoint
@AnonymousAllowed
public class NoteEndpoint {
    private NoteRepository repository;
    private TodoRepository todoRepository;

    public NoteEndpoint(NoteRepository repository, TodoRepository todoRepository) {
        this.repository = repository;
        this.todoRepository = todoRepository;
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
