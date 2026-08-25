import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { LongTermGoalsAnimations } from './long-term-goals.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { LongTermGoalsItemComponent } from './long-term-goals-item/long-term-goals-item.component';
import { LongTermGoal } from '../../../core/store/long-term-goal/long-term-goal.model';
import { LongTermGoalsHeaderComponent } from './long-term-goals-header/long-term-goals-header.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LongTermGoalsModalComponent } from './long-term-goals-modal/long-term-goals-modal.component'
import { MatSnackBar } from '@angular/material/snack-bar';
import { LongTermGoalStore } from 'src/app/core/store/long-term-goal/long-term-goal.store'

@Component({
  selector: 'app-long-term-goals',
  templateUrl: './long-term-goals.component.html',
  styleUrls: ['./long-term-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: LongTermGoalsAnimations,
  standalone: true,
  imports: [
    LongTermGoalsItemComponent,
    LongTermGoalsHeaderComponent,
  ],
})
export class LongTermGoalsComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly longTermGoalStore = inject(LongTermGoalStore);

  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);
  
   longTermGoals: Signal<LongTermGoal | undefined> = computed(() => {
     const longGoals = this.longTermGoalStore.selectFirst([["__userId", "==", this.currentUser()?.__id]],{});
     return longGoals;                                  
      });

  /** For storing the dialogRef in the opened modal. */
  dialogRef: MatDialogRef<any>;
  
  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------
    openModal(editClicked: boolean) {
      this.dialogRef = this.dialog.open(LongTermGoalsModalComponent, {
        height: '90%',
        width: '90%' ,
        position: { bottom: '0' },
        data: 
          {
            longTermGoal: this.longTermGoals(), 
            onSaveAfterClick: async (goals) => {
             if(this.longTermGoals()?.__id){
                await this.updateNewGoal(goals);
              } else{
                await this.addNewGoal(goals);
              }
              this.dialogRef.close();
            },
          },
       });  
     }

  
  /** adding new goals. */
  async addNewGoal(controlValue){
    await this.longTermGoalStore.add(Object.assign({}, { 
      __userId: this.currentUser()?.__id,
      oneYear: controlValue.oneYear,
      fiveYear: controlValue.fiveYear,
    }));
  }

  /** updating existing long term goals. */
  async updateNewGoal(controlValue){
    await this.longTermGoalStore.update(this.longTermGoals()?.__id,Object.assign( {},{
      oneYear: controlValue.oneYear,
      fiveYear: controlValue.fiveYear,
    }));
  }

  // --------------- OTHER -------------------------------

 constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------

  /** fetching the long term goals from the firestore to the signal store. */
  async ngOnInit() {
     await this.longTermGoalStore.load([["__userId", "==", this.currentUser()?.__id]], {});
  }
}