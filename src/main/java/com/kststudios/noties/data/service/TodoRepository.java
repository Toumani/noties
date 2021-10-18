package com.kststudios.noties.data.service;

import com.kststudios.noties.data.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Integer> {
}
