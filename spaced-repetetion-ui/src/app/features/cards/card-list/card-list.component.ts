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
import { MatDialog } from '@angular/material/dialog';
import { CardEditDialogComponent, ConfirmDialogComponent } from '..';
import { TagService } from '../../../core/services/tag.service';
import { ErrorService } from 'src/app/core/services/error.service';

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

  constructor(
    private cardsService: CardsService,
    private dialog: MatDialog,
    private tagService: TagService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.loadTags();
    this.loadCards();
  }

  private loadCards(): void {
    this.cardsService.getCards().subscribe((cards) => {
      this.allCards = cards;
      this.extractAvailableTags();
      this.categorizeCards(cards);
      cards.forEach((card) => this.showAnswersMap.set(card.id, false));
    });
  }

  private loadTags() {
    this.tagService.getUserTags().subscribe({
      next: (tags) => {
        this.availableTags = tags;
      },
      error: (error) => {
        console.error('Error loading tags:', error);
        this.errorService.showError(error);
      },
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
    this.categorizeCards(this.allCards);
  }

  private categorizeCards(cards: Card[]): void {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    this.reviewedCards = cards.filter((card) => {
      const reviewDate = card.lastReviewedAt
        ? new Date(card.lastReviewedAt)
        : null;
      if (reviewDate) {
        reviewDate.setHours(0, 0, 0, 0);
        return (
          reviewDate.getTime() === today.getTime() &&
          !card.reviewedTodayIncorrectly
        );
      }
      return false;
    });

    this.dueCards = cards.filter((card) => {
      const nextReview = new Date(card.nextReviewDate);
      nextReview.setHours(0, 0, 0, 0);
      // Include cards that are due today OR were reviewed incorrectly today
      return (
        nextReview.getTime() <= today.getTime() || card.reviewedTodayIncorrectly
      );
    });

    this.upcomingCards = cards.filter((card) => {
      const nextReview = new Date(card.nextReviewDate);
      nextReview.setHours(0, 0, 0, 0);
      return (
        nextReview.getTime() > today.getTime() && !card.reviewedTodayIncorrectly
      );
    });
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

  editCard(card: Card): void {
    const dialogRef = this.dialog.open(CardEditDialogComponent, {
      width: '90vw',
      maxWidth: '600px',
      data: { ...card },
      panelClass: 'responsive-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cardsService.updateCard(card.id, result).subscribe(() => {
          this.loadCards();
        });
      }
    });
  }

  deleteCard(card: Card): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: {
        title: 'Delete Card',
        message: 'Are you sure you want to delete this card?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cardsService.deleteCard(card.id).subscribe(() => {
          this.loadCards();
        });
      }
    });
  }
}
