package com.example.application.data.entity;

import com.example.application.data.AbstractEntity;

import javax.persistence.Entity;
import javax.validation.constraints.NotBlank;

@Entity
public class Todo extends AbstractEntity {

    @NotBlank
    private String task;
    private boolean done = false;

    public Todo() { }

    public Todo(String task) { this.task = task; }

    public boolean isDone() { return done; }

    public void setDone(boolean done) { this.done = done; }

    public String getTask() { return task; }

    public void setTask(String task) { this.task = task; }
}
