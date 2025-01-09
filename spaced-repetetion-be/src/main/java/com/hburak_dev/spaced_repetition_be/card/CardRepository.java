package com.hburak_dev.spaced_repetition_be.card;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {
  List<Card> findByUserIdOrderByNextReviewDate(Long userId);

  @Query("SELECT c FROM Card c WHERE c.user.id = :userId AND c.nextReviewDate <= :now")
  List<Card> findDueCards(Long userId, LocalDateTime now);

  @Query("SELECT DISTINCT t FROM Card c JOIN c.tags t WHERE c.user.id = :userId")
  List<String> findAllTagsByUserId(Long userId);
}