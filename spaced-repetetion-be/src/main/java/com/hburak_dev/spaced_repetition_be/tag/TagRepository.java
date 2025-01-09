package com.hburak_dev.spaced_repetition_be.tag;

import com.hburak_dev.spaced_repetition_be.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
  Optional<Tag> findByNameAndUser(String name, User user);

  List<Tag> findAllByUser(User user);

  @Query("SELECT t FROM Tag t WHERE t.user = :user AND t NOT IN (SELECT DISTINCT t FROM Card c JOIN c.tags t)")
  List<Tag> findOrphanedTags(@Param("user") User user);
}