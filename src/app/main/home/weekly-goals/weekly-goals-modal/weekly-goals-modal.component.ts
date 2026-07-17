import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { WeeklyGoalsModalAnimations } from './weekly-goals-modal.animations';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { WeeklyGoal } from 'src/app/core/store/weekly-goal/weekly-goal.model';
import { QuarterlyGoalData, WeeklyGoalInForm } from '../../home.model';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatFormField } from '@angular/material/form-field';
import { MatOption } from '@angular/material/core';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatSelectTrigger } from '@angular/material/select';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { endOfWeek, startOfWeek } from 'src/app/core/utils/time.utils';
@Component({
  selector: 'app-weekly-goals-modal',
  templateUrl: './weekly-goals-modal.component.html',
  styleUrls: ['./weekly-goals-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WeeklyGoalsModalAnimations,
  standalone: true,
  imports: [
    MatIconButton,
    MatDialogClose,
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    MatFormField,
    MatInput,
    MatSelect,
    MatSelectTrigger,
    MatOption,
    
  ],
})
export class WeeklyGoalsModalComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  // --------------- INPUTS AND OUTPUTS ------------------
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------
  weeklyGoalsForm = this.fb.group({
    allGoals: this.fb.array([
      this.fb.group({
        text: ['', Validators.required],
        originalText: [''],
        originalOrder: [1],
        __weeklyGoalId: [''],
        __quarterlyGoalId: [''], 
      }),
    ]),
  });

  // --------------- COMPUTED DATA -----------------------
  get allGoals() {
    return this.weeklyGoalsForm.get('allGoals') as FormArray;
  }
  get addedGoalsCount() {
    return this.allGoals.controls.filter(
      (goal) => goal.value._new && !goal.value._deleted
    ).length;
  }
  get editedGoalsCount() {
    return this.allGoals.controls.filter(
      (goal) =>
        goal.dirty &&
        goal.value.text !== goal.value.originalText &&
        !goal.value._new &&
        !goal.value._deleted
    ).length;
  }
  get deletedGoalsCount() {
    return this.allGoals.controls.filter((goal) => goal.value._deleted).length;
  }
  endOfWeek = endOfWeek;
  startOfWeek = startOfWeek;

  // --------------- EVENT HANDLING ----------------------
  addGoalToForm(goal: WeeklyGoalInForm) {
    this.allGoals.push(
      this.fb.group({
        text: [goal ? goal.text : '', [Validators.required, Validators.pattern('.*\\S.*')]],
        __quarterlyGoalId: [goal ? goal.__quarterlyGoalId : '', Validators.required],
        originalText: [goal ? goal.text : ''],
        _deleted: [goal ? goal._deleted : false],
        _new: [goal ? false : true],
      })
    );
    }
  drop(event: CdkDragDrop<WeeklyGoal[]>) {
    moveItemInArray(
      this.allGoals.controls,
      event.previousIndex,
      event.currentIndex,
    );
  }
  moveItemInFormArray(
    formArray: FormArray,
    fromIndex: number,
    toIndex: number,
  ) {
    const dir = toIndex > fromIndex ? 1 : -1;
    const from = fromIndex;
    const to = toIndex;
    const temp = formArray.at(from);
    for (let i = from; i * dir < to * dir; i = i + dir) {
      const current = formArray.at(i + dir);
      formArray.setControl(i, current);
    }
    formArray.setControl(to, temp);
  }
  fullDelete(e, i) {
    if (
      e.target.checked &&
      this.weeklyGoalsForm.get(['allGoals', i, '_new']).value
    ) {
      this.allGoals.removeAt(i);
    }
  }
  async saveGoals() {
    await this.data.updateWeeklyGoals(this.allGoals);
  }
// --------------- OTHER -------------------------------
  constructor(
    private injector: Injector,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      goalDatas: Partial<QuarterlyGoalData>[];
      incompleteGoals: WeeklyGoal[];
      emptyRow: boolean;
      updateWeeklyGoals: (weeklyGoalsFormArray: FormArray) => Promise<void>;
    },
    public dialogRef: MatDialogRef<WeeklyGoalsModalComponent>,
    private fb: FormBuilder,
  ) {
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
