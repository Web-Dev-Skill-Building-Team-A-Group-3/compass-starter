import { Timestamp } from '@angular/fire/firestore';

export interface WeeklyGoal {
  __id: string;
  __userId: string;
  __hashtagId?: string;
  __quarterlyGoalId?: string;
  text: string;
  order: number;
  completed: boolean;
  completionDate?: Timestamp; // When this goal was completed
  notes?: string; // For taking notes on the notes page
  _createdAt?: Timestamp;
  _updatedAt?: Timestamp;
  _deleted?: boolean;
}
