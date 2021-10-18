package com.kststudios.noties.data.entity;

import com.kststudios.noties.data.AbstractEntity;
import com.fasterxml.jackson.annotation.JsonBackReference;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.validation.constraints.NotBlank;

@Entity
public class Todo extends AbstractEntity {

    @NotBlank
    private String task;
    private boolean done = false;
    @ManyToOne
    @JoinColumn(name = "note_id", nullable = false, updatable = false)
    @JsonBackReference
    private Note note;

    public Todo() { }

    public Todo(String task) { this.task = task; }

    public boolean isDone() { return done; }
    public void setDone(boolean done) { this.done = done; }

    public String getTask() { return task; }
    public void setTask(String task) { this.task = task; }
}
