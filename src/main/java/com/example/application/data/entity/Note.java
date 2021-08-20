package com.example.application.data.entity;

import com.example.application.Util;
import com.example.application.data.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.util.List;

@Entity
public class Note extends AbstractEntity {

    @NotBlank
    private String title;
    private LocalDate create;
    private String category;
    private String color;

    @JsonManagedReference
    @OneToMany(mappedBy = "note")
    private List<Todo> todos;

    public Note() {
        this.category = Util.getRandomCategory();
        this.color = Util.getRandomColor();
    }

    public Note(String title) {
        this();
        this.title = title;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public LocalDate getCreate() { return create; }
    public void setCreate(LocalDate create) { this.create = create; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }

    public List<Todo> getTodos() { return todos; }
    public void setTodos(List<Todo> todos) { this.todos = todos; }
}
