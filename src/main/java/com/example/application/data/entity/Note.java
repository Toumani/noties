package com.example.application.data.entity;

import com.example.application.data.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.List;

@Entity
public class Note extends AbstractEntity {

    @NotBlank
    private String title;
    private LocalDateTime create;
    private String category;
    private String color;

    @JsonManagedReference
    @OneToMany(mappedBy = "note")
    private List<Todo> todos;

    public Note() { }

    public Note(String title) {
        this();
        this.title = title;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDateTime getCreate() { return create; }
    public void setCreate(LocalDateTime create) { this.create = create; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public List<Todo> getTodos() { return todos; }
    public void setTodos(List<Todo> todos) { this.todos = todos; }
}
