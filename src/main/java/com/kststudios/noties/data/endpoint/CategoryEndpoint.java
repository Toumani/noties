package com.kststudios.noties.data.endpoint;

import com.kststudios.noties.data.entity.Category;
import com.kststudios.noties.data.service.CategoryRepository;
import com.vaadin.flow.server.connect.Endpoint;
import org.springframework.data.domain.Sort;

import javax.annotation.security.PermitAll;
import java.util.List;
import java.util.Optional;

@Endpoint
@PermitAll
public class CategoryEndpoint {
    private CategoryRepository repository;

    public CategoryEndpoint(CategoryRepository repository) { this.repository = repository; }

    public List<Category> findAll() { return repository.findAll(Sort.by(Sort.Order.asc("name"))); }

    public Optional<Category> findById(Integer id) { return repository.findById(id); }

    public Category save(Category category) { return repository.save(category); }

    public void delete(Category category) { repository.delete(category); }
}
