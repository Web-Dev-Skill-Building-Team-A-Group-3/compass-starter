import { Component, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
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
import { FormArray, FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-weekly-goals-modal',
  templateUrl: './weekly-goals-modal.component.html',
  styleUrls: ['./weekly-goals-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WeeklyGoalsModalAnimations,
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ],
})
export class WeeklyGoalsModalComponent {
  readonly authStore = inject(AuthStore);
  
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  /** Holds all of the rows for weeklygoals that are being shown in the modal. */
  weeklyGoalsForm = this.fb.group({
  	allGoals: this.fb.array([])
    });
  // --------------- COMPUTED DATA -----------------------
  /** Get all of the goals in WeeklyGoalsForm. */
  get allGoals() {
	return this.weeklyGoalsForm.get('allGoals') as FormArray;
  }
  // --------------- EVENT HANDLING ----------------------
  // TODO (2/4): this file and weekly-goals.component.ts should match main's version; the merge kept your branch's old copy and emptied addGoalToForm
  addGoalToForm(goal: any | null) {
  	
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
  
}
