package com.hburak_dev.spaced_repetition_be.card.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class CardDto {
  private Long id;
  private String front;
  private String back;
  private List<String> tags;
  private int level;
  private LocalDateTime nextReviewDate;
  private LocalDateTime lastReviewedAt;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
}