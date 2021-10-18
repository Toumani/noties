package com.kststudios.noties.data.entity;

import com.kststudios.noties.data.AbstractEntity;

import javax.persistence.Entity;
import javax.validation.constraints.NotBlank;

@Entity
public class Category extends AbstractEntity {
    @NotBlank
    private String name;
    private String color;

    public Category() { }

    public Category(String name, String color) {
        this();
        this.name = name;
        this.color = color;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
