package com.hburak_dev.spaced_repetetion_be.tag;

import com.hburak_dev.spaced_repetetion_be.card.Card;
import com.hburak_dev.spaced_repetetion_be.user.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Tag {
  @Id
  @GeneratedValue
  private Long id;

  @Column(nullable = false)
  private String name;

  @ManyToOne(fetch = FetchType.LAZY)
  private User user;

  @ManyToMany(mappedBy = "tags")
  private Set<Card> cards = new HashSet<>();
}