package com.hburak_dev.spaced_repetition_be.card;

import com.hburak_dev.spaced_repetition_be.user.User;
import com.hburak_dev.spaced_repetition_be.tag.Tag;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "card")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Card {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "card_seq")
  @SequenceGenerator(name = "card_seq", sequenceName = "card_seq", allocationSize = 1)
  private Long id;

  @Column(nullable = false)
  private String front;

  @Column(nullable = false)
  private String back;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  @JsonIgnore
  private User user;

  @ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.EAGER)
  @JoinTable(name = "card_tag", joinColumns = @JoinColumn(name = "card_id"), inverseJoinColumns = @JoinColumn(name = "tag_id"))
  @Builder.Default
  private List<Tag> tags = new ArrayList<>();

  private int level;
  private LocalDateTime nextReviewDate;
  private LocalDateTime lastReviewedAt;
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

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