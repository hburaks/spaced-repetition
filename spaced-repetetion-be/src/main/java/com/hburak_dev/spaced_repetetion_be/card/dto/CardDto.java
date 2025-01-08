package com.hburak_dev.spaced_repetetion_be.card.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class CardDto {
  private Long id;
  private String front;
  private String back;
  private Set<String> tags;
  private int level;
  private LocalDateTime nextReviewDate;
  private LocalDateTime lastReviewedAt;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}