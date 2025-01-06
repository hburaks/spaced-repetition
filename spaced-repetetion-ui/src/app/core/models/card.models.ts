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
  tags: string[];
}

export interface CreateCardRequest {
  front: string;
  back: string;
  tags: string[];
}

export interface ReviewResult {
  cardId: string;
  success: boolean;
}
