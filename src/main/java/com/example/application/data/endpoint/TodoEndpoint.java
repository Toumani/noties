package com.example.application.data.endpoint;

import com.example.application.data.entity.Todo;
import com.example.application.data.service.TodoRepository;
import com.vaadin.flow.server.connect.Endpoint;

import javax.annotation.security.PermitAll;
import java.util.List;

@Endpoint
@PermitAll
public class TodoEndpoint {
    private TodoRepository repository;

    public TodoEndpoint(TodoRepository repository) { this.repository = repository; }

    public List<Todo> findAll() { return repository.findAll(); }

    public Todo save(Todo todo) { return repository.save(todo); }

    public void delete(Todo todo) { repository.delete(todo); }
}
