import { Component, OnInit } from '@angular/core';
import { CardsService } from '../../../core/services/cards.service';
import { Card } from '../../../core/models/card.models';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss'],
  animations: [
    trigger('cardList', [
      transition('* <=> *', [animate('300ms ease-in-out')]),
    ]),
  ],
})
export class CardListComponent implements OnInit {
  allCards: Card[] = [];
  dueCards: Card[] = [];
  reviewedCards: Card[] = [];
  upcomingCards: Card[] = [];
  showAnswersMap = new Map<string, boolean>();
  readonly PAGE_SIZE = 12;
  dueCardsExpanded = false;
  reviewedCardsExpanded = false;
  upcomingCardsExpanded = false;

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

  get visibleDueCards(): Card[] {
    return this.dueCardsExpanded
      ? this.dueCards
      : this.dueCards.slice(0, this.PAGE_SIZE);
  }

  get visibleReviewedCards(): Card[] {
    return this.reviewedCardsExpanded
      ? this.reviewedCards
      : this.reviewedCards.slice(0, this.PAGE_SIZE);
  }

  get visibleUpcomingCards(): Card[] {
    return this.upcomingCardsExpanded
      ? this.upcomingCards
      : this.upcomingCards.slice(0, this.PAGE_SIZE);
  }

  toggleSection(section: 'due' | 'reviewed' | 'upcoming'): void {
    switch (section) {
      case 'due':
        this.dueCardsExpanded = !this.dueCardsExpanded;
        break;
      case 'reviewed':
        this.reviewedCardsExpanded = !this.reviewedCardsExpanded;
        break;
      case 'upcoming':
        this.upcomingCardsExpanded = !this.upcomingCardsExpanded;
        break;
    }
  }
}
