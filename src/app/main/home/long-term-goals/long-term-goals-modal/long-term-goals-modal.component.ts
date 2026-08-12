import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector, model } from '@angular/core';
import { LongTermGoalsModalAnimations } from './long-term-goals-modal.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { MatDialogRef,  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-long-term-goals-modal',
  templateUrl: './long-term-goals-modal.component.html',
  styleUrls: ['./long-term-goals-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: LongTermGoalsModalAnimations,
  standalone: true,
  imports: [FormsModule
  ],
})
export class LongTermGoalsModalComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  private readonly dialogRef = inject(MatDialogRef<LongTermGoalsModalComponent>);
  private readonly data = inject( MAT_DIALOG_DATA );
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;
  /** Consts for the goals*/
  oneYearGoal = model(this.data.longTermGoal.oneYear);
  fiveYearGoal = model(this.data.longTermGoal.fiveYear);
  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  // --------------- COMPUTED DATA -----------------------
  /** Computed for validating the goals */
  isSaveDisabled = computed(() => {
      const oneYear = this.oneYearGoal().trim();
      const fiveYear = this.fiveYearGoal().trim();
      return oneYear === '' || fiveYear === '';
    });
  // --------------- EVENT HANDLING ----------------------
  onSave(): void {
      if (this.isSaveDisabled()) return;
  
      this.dialogRef.close({
        oneYearGoal: this.oneYearGoal().trim(),
        fiveYearGoal: this.fiveYearGoal().trim()
      });
    }

  onClose(): void {
    this.dialogRef.close();
  }
  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
  }
}
