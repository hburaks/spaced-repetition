import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, throwIfEmpty, map } from 'rxjs/operators';
import { Card, CreateCardRequest, ReviewResult } from '../models/card.models';
import { environment } from '../../../environments/environment';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private apiUrl = environment.apiUrl;
  private mockCards: Card[] = [
    {
      id: '1',
      front: 'What is Angular?',
      back: 'A TypeScript-based open-source web application framework',
      nextReviewDate: new Date(new Date().setHours(0, 0, 0, 0)), // Due today
      level: 2,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: null,
      tags: ['Angular', 'Framework', 'Basics'],
    },
    {
      id: '2',
      front: 'What is TypeScript?',
      back: 'A strongly typed programming language that builds on JavaScript',
      nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 1)), // Due tomorrow
      level: 1,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: null,
      tags: ['TypeScript', 'Programming Language', 'Basics'],
    },
    {
      id: '3',
      front: 'What is RxJS?',
      back: 'A library for reactive programming using Observables',
      nextReviewDate: new Date(new Date().setDate(new Date().getDate() - 1)), // Due yesterday
      level: 3,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: null,
      tags: ['RxJS', 'Library', 'Reactive Programming'],
    },
    {
      id: '4',
      front: 'What is NgRx?',
      back: 'A framework for building reactive applications in Angular',
      nextReviewDate: new Date(), // Due now
      level: 1,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: new Date(), // Reviewed today
      tags: ['NgRx', 'Framework', 'Reactive Programming'],
    },
    {
      id: '5',
      front: 'What is Dependency Injection in Angular?',
      back: 'A design pattern where a class receives its dependencies from external sources rather than creating them itself',
      nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 2)),
      level: 2,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: null,
      tags: ['Dependency Injection', 'Design Pattern', 'Angular'],
    },
    {
      id: '6',
      front: 'What is a Pure Function?',
      back: 'A function that always returns the same output for the same input and has no side effects',
      nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      level: 4,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: null,
      tags: ['Pure Function', 'Programming', 'Basics'],
    },
    {
      id: '7',
      front: 'What is the difference between let and const in JavaScript?',
      back: 'let allows reassignment of values while const creates a read-only reference to a value',
      nextReviewDate: new Date(new Date().setDate(new Date().getDate() - 2)),
      level: 1,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: null,
      tags: ['JavaScript', 'Basics', 'Variables'],
    },
    {
      id: '8',
      front: 'What is the purpose of NgModule?',
      back: 'To organize related components, directives, pipes, and services into cohesive blocks of functionality',
      nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 14)),
      level: 5,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: null,
      tags: ['NgModule', 'Angular', 'Basics'],
    },
    {
      id: '9',
      front: 'What is the difference between Observable and Promise?',
      back: 'Observables can emit multiple values over time, while Promises only resolve once with a single value',
      nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 3)),
      level: 3,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: new Date(),
      tags: ['Observable', 'Promise', 'Reactive Programming'],
    },
    {
      id: '10',
      front: 'What is the purpose of the async pipe?',
      back: 'To automatically subscribe to Observables in templates and handle unsubscription when component is destroyed',
      nextReviewDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      level: 2,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: null,
      tags: ['Async Pipe', 'Angular', 'Templates'],
    },
    {
      id: '11',
      front: 'What is Tree Shaking?',
      back: 'A process of removing unused code from the final bundle to reduce its size',
      nextReviewDate: new Date(),
      level: 0,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: null,
      tags: ['Tree Shaking', 'Bundling', 'Optimization'],
    },
    {
      id: '12',
      front: 'What is the purpose of ViewChild decorator?',
      back: 'To get a reference to a child component, directive, or DOM element from a parent component',
      nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 5)),
      level: 3,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: null,
      tags: ['ViewChild', 'Angular', 'Basics'],
    },
    {
      id: '13',
      front: 'What is Content Projection in Angular?',
      back: 'A pattern where you insert content from a parent component into a child component using ng-content',
      nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      level: 1,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: null,
      tags: ['Content Projection', 'Angular', 'Basics'],
    },
    {
      id: '14',
      front: 'What is the difference between ngOnInit and constructor?',
      back: 'Constructor is for basic initialization, ngOnInit is for complex initialization after data-bound properties are set',
      nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 4)),
      level: 2,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: new Date(),
      tags: ['ngOnInit', 'Constructor', 'Angular'],
    },
    {
      id: '15',
      front: 'What are Angular Pipes?',
      back: 'Pipes are simple functions to use in template expressions to accept an input value and return a transformed value',
      nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 6)),
      level: 3,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: null,
      tags: ['Angular Pipes', 'Basics', 'Templates'],
    },
    {
      id: '16',
      front: 'What is Angular Change Detection?',
      back: "A mechanism that keeps the template in sync with the component's data properties",
      nextReviewDate: new Date(new Date().setDate(new Date().getDate() - 3)),
      level: 2,
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: new Date(),
      tags: ['Angular Change Detection', 'Basics', 'Performance'],
    },
    // More cards for testing pagination
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `due-${i + 17}`,
      front: `Due Card Question ${i + 1}`,
      back: `Due Card Answer ${i + 1}`,
      nextReviewDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      level: Math.floor(Math.random() * 5),
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: null,
      tags: Array.from(
        { length: Math.min(3, Math.floor(Math.random() * 3) + 1) },
        () => {
          const adjectives = [
            'Interesting',
            'Useful',
            'Educational',
            'Fun',
            'Challenging',
          ];
          const nouns = [
            'Concept',
            'Technology',
            'Framework',
            'Language',
            'Pattern',
          ];
          return `${
            adjectives[Math.floor(Math.random() * adjectives.length)]
          } ${nouns[Math.floor(Math.random() * nouns.length)]}`;
        }
      ),
    })),
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `reviewed-${i + 42}`,
      front: `Reviewed Card Question ${i + 1}`,
      back: `Reviewed Card Answer ${i + 1}`,
      nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      level: Math.floor(Math.random() * 5),
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: new Date(),
      tags: Array.from(
        { length: Math.min(3, Math.floor(Math.random() * 3) + 1) },
        () => {
          const adjectives = [
            'Interesting',
            'Useful',
            'Educational',
            'Fun',
            'Challenging',
          ];
          const nouns = [
            'Concept',
            'Technology',
            'Framework',
            'Language',
            'Pattern',
          ];
          return `${
            adjectives[Math.floor(Math.random() * adjectives.length)]
          } ${nouns[Math.floor(Math.random() * nouns.length)]}`;
        }
      ),
    })),
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `upcoming-${i + 67}`,
      front: `Upcoming Card Question ${i + 1}`,
      back: `Upcoming Card Answer ${i + 1}`,
      nextReviewDate: new Date(new Date().setDate(new Date().getDate() + 7)),
      level: Math.floor(Math.random() * 5),
      userId: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      lastReviewedAt: null,
      tags: Array.from(
        { length: Math.min(3, Math.floor(Math.random() * 3) + 1) },
        () => {
          const adjectives = [
            'Interesting',
            'Useful',
            'Educational',
            'Fun',
            'Challenging',
          ];
          const nouns = [
            'Concept',
            'Technology',
            'Framework',
            'Language',
            'Pattern',
          ];
          return `${
            adjectives[Math.floor(Math.random() * adjectives.length)]
          } ${nouns[Math.floor(Math.random() * nouns.length)]}`;
        }
      ),
    })),
  ];

  constructor(private http: HttpClient, private errorService: ErrorService) {}

  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}/cards`).pipe(
      map((cards) =>
        cards.map((card) => ({
          ...card,
          reviewedTodayIncorrectly: this.isReviewedTodayAndDueToday(card),
          reviewedTodayCorrectly: this.isReviewedTodayCorrectly(card),
        }))
      ),
      catchError((error) => {
        this.errorService.showError();
        return throwError(() => error);
      })
    );
  }

  private isReviewedTodayAndDueToday(card: Card): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reviewDate = card.lastReviewedAt
      ? new Date(card.lastReviewedAt)
      : null;
    const nextReviewDate = new Date(card.nextReviewDate);

    if (reviewDate) reviewDate.setHours(0, 0, 0, 0);
    nextReviewDate.setHours(0, 0, 0, 0);

    // If reviewed today and still due today, it was an incorrect review
    return (
      reviewDate?.getTime() === today.getTime() &&
      nextReviewDate.getTime() === today.getTime()
    );
  }

  private isReviewedTodayCorrectly(card: Card): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const reviewDate = card.lastReviewedAt
      ? new Date(card.lastReviewedAt)
      : null;
    const nextReviewDate = new Date(card.nextReviewDate);

    if (reviewDate) reviewDate.setHours(0, 0, 0, 0);
    nextReviewDate.setHours(0, 0, 0, 0);

    // If reviewed today and next review is in the future, it was a correct review
    return (
      reviewDate?.getTime() === today.getTime() &&
      nextReviewDate.getTime() > today.getTime()
    );
  }

  getCardsForReview(): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}/cards/review`).pipe(
      catchError((error) => {
        this.errorService.showError();
        return throwError(() => error);
      })
    );
  }

  createCard(card: CreateCardRequest): Observable<Card> {
    return this.http.post<Card>(`${this.apiUrl}/cards`, card).pipe(
      catchError((error) => {
        this.errorService.showError();
        return throwError(() => error);
      })
    );
  }

  // Based on Ncase's "How to Remember Anything Forever-ish" algorithm
  private calculateNextReview(level: number, success: boolean): Date {
    const now = new Date();
    if (!success) return now; // Review immediately on failure

    // Exponential backoff based on level: 1 day -> 3 days -> 7 days -> 14 days -> 30 days
    const daysUntilReview = Math.pow(2, level) - 1;
    const nextReview = new Date();
    nextReview.setDate(now.getDate() + daysUntilReview);
    return nextReview;
  }

  submitReview(review: ReviewResult): Observable<Card> {
    console.log('calling submitReview', review);
    return this.http
      .post<Card>(`${this.apiUrl}/cards/${review.cardId}/review`, review)
      .pipe(
        catchError((error) => {
          this.errorService.showError();
          return throwError(() => error);
        })
      );
  }

  deleteCard(cardId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/cards/${cardId}`);
  }

  updateCard(cardId: string, card: CreateCardRequest): Observable<Card> {
    return this.http.put<Card>(`${this.apiUrl}/cards/${cardId}`, card);
  }
}
