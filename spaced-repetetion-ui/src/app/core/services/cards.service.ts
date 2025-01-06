import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Card, CreateCardRequest, ReviewResult } from '../models/card.models';

@Injectable({
  providedIn: 'root',
})
export class CardsService {
  private apiUrl = 'http://localhost:3000/api';
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
    },
  ];

  constructor(private http: HttpClient) {}

  getCards(): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.apiUrl}/cards`).pipe(
      catchError(() => {
        // Sort cards by nextReviewDate
        return of(
          this.mockCards.sort(
            (a, b) =>
              new Date(a.nextReviewDate).getTime() -
              new Date(b.nextReviewDate).getTime()
          )
        );
      })
    );
  }

  getCardsForReview(): Observable<Card[]> {
    return this.http
      .get<Card[]>(`${this.apiUrl}/cards/review`)
      .pipe(catchError(() => of(this.mockCards)));
  }

  createCard(card: CreateCardRequest): Observable<Card> {
    return this.http.post<Card>(`${this.apiUrl}/cards`, card).pipe(
      catchError(() => {
        const newCard: Card = {
          ...this.mockCards[0],
          id: (Math.random() * 1000).toString(),
          front: card.front,
          back: card.back,
        };
        return of(newCard);
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
    return this.http
      .post<Card>(`${this.apiUrl}/cards/${review.cardId}/review`, review)
      .pipe(
        catchError(() => {
          const card = { ...this.mockCards[0] };
          // Update level based on success/failure
          card.level = review.success ? card.level + 1 : 0;
          card.nextReviewDate = this.calculateNextReview(
            card.level,
            review.success
          );
          card.lastReviewedAt = new Date();
          return of(card);
        })
      );
  }
}
