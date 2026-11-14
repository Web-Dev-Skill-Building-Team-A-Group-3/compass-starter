import { Component, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { WeeklyGoalsAnimations } from './weekly-goals.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { WeeklyGoalsHeaderComponent } from './weekly-goals-header/weekly-goals-header.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuarterlyGoalsData, WeeklyGoalData} from '../home.model';
import { Timestamp } from '@angular/fire/firestore';
import { WeeklyGoalsModalComponent } from './weekly-goals-modal/weekly-goals-modal.component';
import { WeeklyGoalsItemComponent } from './weekly-goals-item/weekly-goals-item.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { WeeklyGoalStore } from '../../../core/store/weekly-goal/weekly-goal.store';
import { WeeklyGoal } from '../../../core/store/weekly-goal/weekly-goal.model';
import { QuarterlyGoalStore,  LoadQuarterlyGoal } from 'src/app/core/store/quarterly-goal/quarterly-goal.store';
import { HashtagStore, LoadHashtag } from 'src/app/core/store/hashtag/hashtag.store';
import { getStartWeekDate } from '../../../core/utils/time.utils';

@Component({
  selector: 'app-weekly-goals',
  templateUrl: './weekly-goals.component.html',
  styleUrls: ['./weekly-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WeeklyGoalsAnimations,
  standalone: true,
  imports: [
    WeeklyGoalsHeaderComponent,
    WeeklyGoalsItemComponent,
  ],
})
export class WeeklyGoalsComponent {
  readonly authStore = inject(AuthStore);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  readonly weeklyGoalStore = inject(WeeklyGoalStore);
  readonly hashtagStore = inject(HashtagStore);
  readonly quarterlyGoalStore = inject(QuarterlyGoalStore);
  private batch: BatchWriteService = inject(BATCH_WRITE_SERVICE);
  
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  /** Placeholder data that is being used until we can use real data. */
  quarterlyGoals: Signal<QuarterlyGoalsData[]> = signal([
    {
      __id: 'qg1',
      __userId: 'test-user',
      __hashtagId: 'ht1',
      text: 'Finish cover letters',
      completed: false,
      order: 1,
      _createdAt: Timestamp.now(),
      _updatedAt: Timestamp.now(),
      _deleted: false,
      hashtag: {
        __id: 'ht1',
        name: 'apply-internships',
        color: '#2DBDB1',
        _createdAt: Timestamp.now(),
        _updatedAt: Timestamp.now(),
        _deleted: false,
      },
      weeklyGoalsTotal: 1,
      weeklyGoalsComplete: 0,
    },
    {
      __id: 'qg2',
      __userId: 'test-user',
      __hashtagId: 'ht2',
      text: 'Apply to internships',
      completed: false,
      order: 2,
      _createdAt: Timestamp.now(),
      _updatedAt: Timestamp.now(),
      _deleted: false,
      hashtag: {
        __id: 'ht2',
        name: 'apply-internships',
        color: '#2DBDB1',
        _createdAt: Timestamp.now(),
        _updatedAt: Timestamp.now(),
        _deleted: false,
      },
      weeklyGoalsTotal: 1,
      weeklyGoalsComplete: 0,
    },
    {
      __id: 'qg3',
      __userId: 'test-user',
      __hashtagId: 'ht3',
      text: 'Review data structures',
      completed: false,
      order: 3,
      _createdAt: Timestamp.now(),
      _updatedAt: Timestamp.now(),
      _deleted: false,
      hashtag: {
        __id: 'ht3',
        name: 'class-algorithms',
        color: '#FFB987',
        _createdAt: Timestamp.now(),
        _updatedAt: Timestamp.now(),
        _deleted: false,
      },
      weeklyGoalsTotal: 1,
      weeklyGoalsComplete: 1,
    },
  ]);

  /** Reference to the open the WeeklyGoal Modal, allowing us to read/close the modal. */
  dialogRef: MatDialogRef<any>;
  
  dialogRef: MatDialogRef<any>
  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------
    
      async checkGoal(
        goal: WeeklyGoalData,
        completed: boolean,
      ): Promise<void> {
        await this.weeklyGoalStore.update(goal.__id, {
          completed,
          completionDate: completed ? Timestamp.now() : null,
        });
      }
  openModal(editClicked: boolean) {
      this.dialogRef = this.dialog.open(WeeklyGoalsModalComponent, {
          height: '90%',
          position: { bottom: '0' },
          panelClass: 'goal-modal-panel',
          data: {
            incompleteGoals: this.incompleteWeeklyGoals(),
            emptyRow: !editClicked,

            updateWeeklyGoals: async (weeklyGoalsFormArray) => {
		  try {
        await this.batch.batchWrite(async (batchConfig) => {
          for (const [i, control] of weeklyGoalsFormArray.controls.entries()) {
            if (!control.value.__id) {
              await this.addNewGoal(control.value, i, batchConfig);
            } else if (control.value._deleted) {
              await this.removeGoal(control.value, batchConfig);
            } else {
              await this.updateGoal(control.value, i, batchConfig);
            }
          }
        }, {
			  snackBarConfig: {
				successMessage: 'Goals successfully updated',
				failureMessage: 'Goal not added successfully',
				undoOnAction: true,
				config: { duration: 1000 },
			  },
			});
			this.dialogRef.close();
    	   } catch(e){
            console.error(e)
          }  
		}
	  }
	});
  }
  
  // --------------- OTHER -------------------------------

    constructor(
     private injector: Injector,
) { }

    
    /** Adds a goal based off form values */
      async addNewGoal(controlValue, i, batchConfig) {
    	await this.weeklyGoalStore.add(Object.assign({}, {
    	  __userId: this.currentUser()?.__id,
    	  __quarterlyGoalId: controlValue.__quarterlyGoalId,
    	  text: controlValue.text,
    	  completed: false,
    	  order: i + 1,
    	}), { batchConfig });
      }
    
      /** Removes some goal based off form values */
      async removeGoal(controlValue, batchConfig) {
    	await this.weeklyGoalStore.remove(controlValue.__id, { batchConfig });
      }
    
      /** Updates some goal based off form values */
      async updateGoal(controlValue, i, batchConfig) {
    	// text or quarterly goal has changed, general update
        	if (controlValue.originalText !== controlValue.text || controlValue.originalOrder !== i+1 || controlValue.originalQuarterlyGoalId !==
  controlValue.__quarterlyGoalId) {
    	  await this.weeklyGoalStore.update(controlValue.__id, Object.assign({}, {
    		__quarterlyGoalId: controlValue.__quarterlyGoalId,
    		text: controlValue.text,
    		order: i + 1,
    	  }), { batchConfig });
    	}
      }
    // --------------- LOAD AND CLEANUP --------------------
    private readonly loadGoalRelations = (goal: WeeklyGoal) => [
  LoadQuarterlyGoal.create(
    this.quarterlyGoalStore,
    [['__id', '==', goal.__quarterlyGoalId]],
    {},
    (quarterlyGoal) => [
      LoadHashtag.create(
        this.hashtagStore,
        [['__id', '==', quarterlyGoal.__hashtagId]],
        {},
      ),
    ],
  ),
];
  
}
