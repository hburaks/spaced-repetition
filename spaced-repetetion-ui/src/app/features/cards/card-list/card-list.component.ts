import { Component, OnInit } from '@angular/core';
import { CardsService } from '../../../core/services/cards.service';
import { Card } from '../../../core/models/card.models';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
})
export class CardListComponent implements OnInit {
  allCards: Card[] = [];
  dueCards: Card[] = [];
  reviewedCards: Card[] = [];
  upcomingCards: Card[] = [];
  showAnswersMap = new Map<string, boolean>();

  constructor(private cardsService: CardsService) {}

  ngOnInit(): void {
    this.loadCards();
  }

  private loadCards(): void {
    this.cardsService.getCards().subscribe((cards) => {
      this.allCards = cards;
      this.categorizeCards();
      cards.forEach((card) => this.showAnswersMap.set(card.id, false));
    });
  }

  private categorizeCards(): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    this.reviewedCards = this.allCards.filter(
      (card) => card.lastReviewedAt && new Date(card.lastReviewedAt) >= today
    );

    this.dueCards = this.allCards.filter(
      (card) =>
        new Date(card.nextReviewDate) <= now &&
        (!card.lastReviewedAt || new Date(card.lastReviewedAt) < today)
    );

    this.upcomingCards = this.allCards.filter(
      (card) => new Date(card.nextReviewDate) > now
    );
  }

  toggleAnswer(cardId: string): void {
    this.showAnswersMap.set(cardId, !this.showAnswersMap.get(cardId));
  }

  isAnswerVisible(cardId: string): boolean {
    return this.showAnswersMap.get(cardId) || false;
  }
}
