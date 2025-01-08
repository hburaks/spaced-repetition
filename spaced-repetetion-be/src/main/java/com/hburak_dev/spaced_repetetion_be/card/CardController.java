package com.hburak_dev.spaced_repetetion_be.card;

import com.hburak_dev.spaced_repetetion_be.card.dto.CardDto;
import com.hburak_dev.spaced_repetetion_be.card.dto.CreateCardRequest;
import com.hburak_dev.spaced_repetetion_be.card.dto.ReviewRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CardController {
  private final CardService cardService;

  @GetMapping
  public ResponseEntity<List<CardDto>> getAllCards() {
    return ResponseEntity.ok(cardService.getAllCards());
  }

  @GetMapping("/review")
  public ResponseEntity<List<CardDto>> getCardsForReview() {
    return ResponseEntity.ok(cardService.getCardsForReview());
  }

  @PostMapping
  public ResponseEntity<CardDto> createCard(@RequestBody CreateCardRequest request) {
    return ResponseEntity.ok(cardService.createCard(
        request.getFront(),
        request.getBack(),
        request.getTags()));
  }

  @PostMapping("/{id}/review")
  public ResponseEntity<CardDto> submitReview(
      @PathVariable Long id,
      @RequestBody ReviewRequest request) {
    return ResponseEntity.ok(cardService.submitReview(id, request.isSuccess()));
  }
}