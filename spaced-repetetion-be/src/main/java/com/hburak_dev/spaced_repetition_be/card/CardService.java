package com.hburak_dev.spaced_repetition_be.card;

import com.hburak_dev.spaced_repetition_be.card.dto.CardDto;
import com.hburak_dev.spaced_repetition_be.user.User;
import com.hburak_dev.spaced_repetition_be.user.UserService;
import com.hburak_dev.spaced_repetition_be.tag.Tag;
import com.hburak_dev.spaced_repetition_be.tag.TagRepository;
import com.hburak_dev.spaced_repetition_be.tag.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Set;

@Service
@Transactional
@RequiredArgsConstructor
public class CardService {
  private final CardRepository cardRepository;
  private final TagRepository tagRepository;
  private final UserService userService;
  private final TagService tagService;

  public List<CardDto> getAllCards() {
    User user = userService.getCurrentUser();
    return cardRepository.findByUserIdOrderByNextReviewDate(user.getId())
        .stream()
        .peek(card -> card.getTags().size()) // Initialize tags
        .map(this::mapToDto)
        .collect(Collectors.toList());
  }

  public List<CardDto> getCardsForReview() {
    User user = userService.getCurrentUser();
    return cardRepository.findDueCards(user.getId(), LocalDateTime.now())
        .stream()
        .map(this::mapToDto)
        .collect(Collectors.toList());
  }

  public CardDto createCard(String front, String back, List<String> tagNames) {
    User currentUser = userService.getCurrentUser();

    // Get or create tags for the current user
    List<Tag> tags = tagNames.stream()
        .map(name -> tagRepository.findByNameAndUser(name, currentUser)
            .orElseGet(() -> tagRepository.save(Tag.builder()
                .name(name)
                .user(currentUser)
                .build())))
        .collect(Collectors.toList());

    Card card = Card.builder()
        .front(front)
        .back(back)
        .user(currentUser)
        .tags(tags)
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

  public void deleteCard(Long cardId) {
    Card card = cardRepository.findById(cardId)
        .orElseThrow(() -> new RuntimeException("Card not found"));

    // Verify user owns the card
    User user = userService.getCurrentUser();
    if (!card.getUser().getId().equals(user.getId())) {
      throw new RuntimeException("Not authorized to delete this card");
    }

    cardRepository.delete(card);
    tagService.deleteOrphanedTags();
  }

  public CardDto updateCard(Long cardId, String front, String back, List<String> tagNames) {
    Card card = cardRepository.findById(cardId)
        .orElseThrow(() -> new RuntimeException("Card not found"));

    User user = userService.getCurrentUser();
    if (!card.getUser().getId().equals(user.getId())) {
      throw new RuntimeException("Not authorized to update this card");
    }

    List<Tag> tags = tagNames.stream()
        .map(name -> tagRepository.findByNameAndUser(name, user)
            .orElseGet(() -> tagRepository.save(Tag.builder()
                .name(name)
                .user(user)
                .build())))
        .collect(Collectors.toList());

    card.setFront(front);
    card.setBack(back);
    card.setTags(tags);

    return mapToDto(cardRepository.save(card));
  }

  private LocalDateTime calculateNextReview(int level) {
    // Based on exponential spacing: 1 -> 3 -> 7 -> 14 -> 30 days
    int days = (int) (Math.pow(2, level) - 1);
    return LocalDateTime.now().plusDays(days);
  }

  private CardDto mapToDto(Card card) {
    return CardDto.builder()
        .id(card.getId())
        .front(card.getFront())
        .back(card.getBack())
        .tags(card.getTags().stream()
            .map(Tag::getName)
            .collect(Collectors.toList()))
        .level(card.getLevel())
        .nextReviewDate(card.getNextReviewDate())
        .lastReviewedAt(card.getLastReviewedAt())
        .createdAt(card.getCreatedAt())
        .updatedAt(card.getUpdatedAt())
        .build();
  }
}