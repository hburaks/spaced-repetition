package com.hburak_dev.spaced_repetition_be.tag;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hburak_dev.spaced_repetition_be.user.User;
import com.hburak_dev.spaced_repetition_be.card.Card;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tag")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Tag {
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "tag_seq")
  @SequenceGenerator(name = "tag_seq", sequenceName = "tag_seq", allocationSize = 1)
  private Long id;

  @Column(nullable = false)
  private String name;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToMany(mappedBy = "tags")
  @Builder.Default
  private List<Card> cards = new ArrayList<>();
}
