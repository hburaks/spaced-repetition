import { Component, OnInit } from '@angular/core';
import { CardsService } from '../../../core/services/cards.service';
import { Card } from '../../../core/models/card.models';

@Component({
  selector: 'app-card-review',
  templateUrl: './card-review.component.html',
  styleUrls: ['./card-review.component.scss'],
})
export class CardReviewComponent implements OnInit {
  cards: Card[] = [];
  currentCard?: Card;
  showAnswer = false;
  isLoading = true;

  constructor(private cardsService: CardsService) {}

  ngOnInit(): void {
    this.loadCards();
  }

  private loadCards(): void {
    this.isLoading = true;
    this.cardsService.getCardsForReview().subscribe({
      next: (cards) => {
        this.cards = cards;
        this.nextCard();
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  nextCard(): void {
    this.currentCard = this.cards.shift();
    this.showAnswer = false;
  }

  submitReview(success: boolean): void {
    if (this.currentCard) {
      this.cardsService
        .submitReview({ cardId: this.currentCard.id, success })
        .subscribe({
          next: () => {
            this.nextCard();
          },
        });
    }
  }
}
