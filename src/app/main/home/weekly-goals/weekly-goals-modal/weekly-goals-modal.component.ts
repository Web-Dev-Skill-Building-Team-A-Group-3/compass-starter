import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { WeeklyGoalsModalAnimations } from './weekly-goals-modal.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { WeeklyGoal } from 'src/app/core/store/weekly-goal/weekly-goal.model';
import { QuarterlyGoalsData, WeeklyGoalInForm } from '../../home.model';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { endOfWeek, startOfWeek } from 'src/app/core/utils/time.utils';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-weekly-goals-modal',
  templateUrl: './weekly-goals-modal.component.html',
  styleUrls: ['./weekly-goals-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WeeklyGoalsModalAnimations,
  standalone: true,
  imports: [
  ],
})
export class WeeklyGoalsModalComponent implements OnInit {
  readonly authStore = inject(AuthStore);

  allGoals : FormArray;
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------
  async addGoalToForm(goal: Partial<WeeklyGoalInForm> | null) {
    this.allGoals.push(
      this.fb.group({
         text: [goal?.text??''],
         __quarterlyGoalId:[goal?.__quarterlyGoalId ?? null],
         originalText: [goal?.originalText ?? ''],
         originalOrder:[goal?.originalOrder??''],
         originalQuarterlyGoalId:[goal?.originalQuarterlyGoalId??''],
         __weeklyGoalId:[goal?.__weeklyGoalId ?? null],
         _deleted:[goal?._deleted ?? false],
         _new: [goal?._new ?? true],
      })
    );
  }
  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      goalDatas: Partial<QuarterlyGoalsData>[];
      incompleteGoals: WeeklyGoal[];
      emptyRow: boolean;
      updateWeeklyGoals: (weeklyGoalsFormArray: FormArray) => Promise<void>;
    },
    public dialogRef: MatDialogRef<WeeklyGoalsModalComponent>,
    private fb: FormBuilder,
  ) {
    this.allGoals = this.fb.array([]);
    this.allGoals.clear();
    if (this.data.incompleteGoals.length == 0) {
      this.addGoalToForm(null);
    } else {
      this.data.incompleteGoals.forEach((goal) => {
        this.addGoalToForm({
          text: goal.text,
          __quarterlyGoalId: goal.__quarterlyGoalId,
          originalText: goal.text,
          originalOrder: goal.order,
          originalQuarterlyGoalId: goal.__quarterlyGoalId,
          __weeklyGoalId: goal.__id,
          _deleted: goal._deleted,
          _new: false,
        });
      });
      if (this.data.emptyRow){
      this.addGoalToForm(null);
      }
    }
  }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
  }
}
