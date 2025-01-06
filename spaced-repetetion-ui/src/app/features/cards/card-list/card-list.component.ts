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
  readonly PAGE_SIZE = 9;
  dueCardsExpanded = false;
  reviewedCardsExpanded = false;
  upcomingCardsExpanded = false;
  availableTags: string[] = [];
  selectedTags: string[] = [];
  popularTags: string[] = [];
  searchTags: string[] = [];
  tagSearchQuery: string = '';
  filteredTags: string[] = [];

  constructor(private cardsService: CardsService) {}

  ngOnInit(): void {
    this.loadCards();
  }

  private loadCards(): void {
    this.cardsService.getCards().subscribe((cards) => {
      this.allCards = cards;
      this.extractAvailableTags();
      this.categorizeCards();
      cards.forEach((card) => this.showAnswersMap.set(card.id, false));
    });
  }

  private extractAvailableTags(): void {
    const tagCount = new Map<string, number>();
    this.allCards.forEach((card) =>
      card.tags.slice(0, 3).forEach((tag) => {
        // Limit to first 3 tags
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      })
    );

    // Get top 5 most used tags
    this.popularTags = Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([tag]) => tag);

    // Rest of the tags for search
    this.searchTags = Array.from(tagCount.keys())
      .filter((tag) => !this.popularTags.includes(tag))
      .sort();

    this.availableTags = [...this.popularTags];
    this.filteredTags = [...this.availableTags];
  }

  filterTagsBySearch(query: string): void {
    this.tagSearchQuery = query;
    if (!query) {
      this.filteredTags = Array.from(
        new Set([...this.popularTags, ...this.searchTags])
      );
      return;
    }

    const searchResults = [...this.popularTags, ...this.searchTags].filter(
      (tag) =>
        tag.toLowerCase().includes(query.toLowerCase()) &&
        !this.selectedTags.includes(tag)
    );
    this.filteredTags = searchResults;
  }

  onTagSelected(event: any): void {
    if (event.isUserInput && event.source.selected) {
      this.toggleTag(event.source.value);
      this.tagSearchQuery = '';
    }
  }

  private filterCardsByTags(cards: Card[]): Card[] {
    if (!this.selectedTags.length) return cards;
    return cards.filter((card) =>
      this.selectedTags.every((tag) => card.tags.includes(tag))
    );
  }

  toggleTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
    this.categorizeCards();
  }

  private categorizeCards(): void {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const filteredCards = this.filterCardsByTags(this.allCards);

    this.reviewedCards = filteredCards.filter(
      (card) => card.lastReviewedAt && new Date(card.lastReviewedAt) >= today
    );

    this.dueCards = filteredCards.filter(
      (card) =>
        new Date(card.nextReviewDate) <= now &&
        (!card.lastReviewedAt || new Date(card.lastReviewedAt) < today)
    );

    this.upcomingCards = filteredCards.filter(
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

  onTagSearchFocus(): void {
    this.filteredTags = Array.from(
      new Set([...this.popularTags, ...this.searchTags])
    );
  }
}
