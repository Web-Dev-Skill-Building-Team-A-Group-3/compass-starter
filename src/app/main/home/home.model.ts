import { QuarterlyGoal } from 'src/app/core/store/quarterly-goal/quarterly-goal.model';
import { Hashtag } from '../../core/store/hashtag/hashtag.model';
import { WeeklyGoal } from '../../core/store/weekly-goal/weekly-goal.model';
export interface WeeklyGoalInForm {
  text: string;
  originalText?: string;
  originalOrder?: number;
  originalQuarterlyGoalId?: string;
  __quarterlyGoalId: string;
  _deleted: boolean;
  __weeklyGoalId?: string;
  _new: boolean;
}

export interface WeeklyGoalData extends WeeklyGoal {
  hashtag: Partial<Hashtag>;
}

export interface QuarterlyGoalData extends QuarterlyGoal {
  hashtag: Partial<Hashtag>;
  weeklyGoalsTotal: number;
  weeklyGoalsComplete: number;
}
