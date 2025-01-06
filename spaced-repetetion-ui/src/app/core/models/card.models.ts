export interface Card {
  id: string;
  front: string;
  back: string;
  nextReviewDate: Date;
  level: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  lastReviewedAt: Date | null;
}

export interface CreateCardRequest {
  front: string;
  back: string;
}

export interface ReviewResult {
  cardId: string;
  success: boolean;
}
