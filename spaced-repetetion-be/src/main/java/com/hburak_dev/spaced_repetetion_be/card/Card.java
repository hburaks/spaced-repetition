package com.hburak_dev.spaced_repetetion_be.card;

import com.hburak_dev.spaced_repetetion_be.user.User;
import com.hburak_dev.spaced_repetetion_be.tag.Tag;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.HashSet;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Card {
  @Id
  @GeneratedValue
  private Long id;

  @Column(nullable = false)
  private String front;

  @Column(nullable = false)
  private String back;

  @ManyToMany
  @JoinTable(name = "card_tags", joinColumns = @JoinColumn(name = "card_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
  private Set<Tag> tags = new HashSet<>();

  private int level;
  private LocalDateTime nextReviewDate;
  private LocalDateTime lastReviewedAt;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  private User user;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
    level = 0;
    nextReviewDate = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }
}