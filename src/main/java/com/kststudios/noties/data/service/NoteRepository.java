package com.kststudios.noties.data.service;

import com.kststudios.noties.data.entity.Note;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoteRepository extends JpaRepository<Note, Integer> {
}
