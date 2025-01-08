package com.hburak_dev.spaced_repetetion_be.card;

import com.hburak_dev.spaced_repetetion_be.card.dto.CardDto;
import com.hburak_dev.spaced_repetetion_be.user.User;
import com.hburak_dev.spaced_repetetion_be.user.UserRepository;
import com.hburak_dev.spaced_repetetion_be.tag.Tag;
import com.hburak_dev.spaced_repetetion_be.tag.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class CardService {
  private final CardRepository cardRepository;
  private final UserRepository userRepository;
  private final TagRepository tagRepository;

  public List<CardDto> getAllCards() {
    User user = getCurrentUser();
    return cardRepository.findByUserIdOrderByNextReviewDate(user.getId())
        .stream()
        .map(this::mapToDto)
        .collect(Collectors.toList());
  }

  public List<CardDto> getCardsForReview() {
    User user = getCurrentUser();
    return cardRepository.findDueCards(user.getId(), LocalDateTime.now())
        .stream()
        .map(this::mapToDto)
        .collect(Collectors.toList());
  }

  public CardDto createCard(String front, String back, Set<String> tagNames) {
    User user = getCurrentUser();

    Set<Tag> tags = tagNames.stream()
        .map(name -> tagRepository.findByNameAndUserId(name, user.getId())
            .orElseGet(() -> tagRepository.save(Tag.builder()
                .name(name)
                .user(user)
                .build())))
        .collect(Collectors.toSet());

    Card card = Card.builder()
        .front(front)
        .back(back)
        .tags(tags)
        .user(user)
        .build();

    return mapToDto(cardRepository.save(card));
  }

  public CardDto submitReview(Long cardId, boolean success) {
    Card card = cardRepository.findById(cardId)
        .orElseThrow(() -> new RuntimeException("Card not found"));

    if (success) {
      card.setLevel(card.getLevel() + 1);
    } else {
      card.setLevel(0);
    }

    card.setLastReviewedAt(LocalDateTime.now());
    card.setNextReviewDate(calculateNextReview(card.getLevel()));

    return mapToDto(cardRepository.save(card));
  }

  private LocalDateTime calculateNextReview(int level) {
    // Based on exponential spacing: 1 -> 3 -> 7 -> 14 -> 30 days
    int days = (int) (Math.pow(2, level) - 1);
    return LocalDateTime.now().plusDays(days);
  }

  private User getCurrentUser() {
    String email = SecurityContextHolder.getContext().getAuthentication().getName();
    return userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("User not found"));
  }

  private CardDto mapToDto(Card card) {
    return CardDto.builder()
        .id(card.getId())
        .front(card.getFront())
        .back(card.getBack())
        .tags(card.getTags().stream()
            .map(Tag::getName)
            .collect(Collectors.toSet()))
        .level(card.getLevel())
        .nextReviewDate(card.getNextReviewDate())
        .lastReviewedAt(card.getLastReviewedAt())
        .createdAt(card.getCreatedAt())
        .updatedAt(card.getUpdatedAt())
        .build();
  }
}