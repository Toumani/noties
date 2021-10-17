package com.example.application.data.entity;

import com.example.application.data.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Note extends AbstractEntity {

    @NotBlank
    private String title;
    private LocalDateTime created;

    @JsonManagedReference
    @OneToMany(mappedBy = "note", cascade = CascadeType.ALL)
    private List<Todo> todos;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    public Note() { }

    public Note(String title) {
        this();
        this.title = title;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDateTime getCreated() { return created; }
    public void setCreated(LocalDateTime created) { this.created = created; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public List<Todo> getTodos() { return todos; }
    public void setTodos(List<Todo> todos) { this.todos = todos; }
}
