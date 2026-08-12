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
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  readonly exampleLongTermGoal: LongTermGoal = {
    __id: 'ltg',
    __userId: 'user-1',
    oneYear: 'Secure SWE or UX Engineering Internship',
    fiveYear: 'SWE with UX, design, or animation-oriented work',
  };

    /** For storing the dialogRef in the opened modal. */
  dialogRef: MatDialogRef<any>;

  

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------
    openModal(editClicked: boolean) {
    this.dialogRef = this.dialog.open(LongTermGoalsModalComponent, {
      height: '90%',
      width: '90%' ,
      position: { bottom: '0' },
      data: {longTermGoal: this.exampleLongTermGoal}
    })
  }

  // --------------- OTHER -------------------------------

 constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) { }


  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
  }
  
}