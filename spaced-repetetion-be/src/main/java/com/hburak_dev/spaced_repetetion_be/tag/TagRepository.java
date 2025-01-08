package com.hburak_dev.spaced_repetetion_be.tag;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
  List<Tag> findByUserId(Long userId);

  Optional<Tag> findByNameAndUserId(String name, Long userId);

  List<Tag> findByNameContainingAndUserId(String name, Long userId);
}