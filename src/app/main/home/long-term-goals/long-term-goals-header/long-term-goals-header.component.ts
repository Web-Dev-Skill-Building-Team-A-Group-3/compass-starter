import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { LongTermGoalsHeaderAnimations } from './long-term-goals-header.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-long-term-goals-header',
  templateUrl: './long-term-goals-header.component.html',
  styleUrls: ['./long-term-goals-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: LongTermGoalsHeaderAnimations,
  standalone: true,
  imports: [ ],
})
export class LongTermGoalsHeaderComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  private readonly snackBar = inject(MatSnackBar);
  
  // --------------- INPUTS AND OUTPUTS ------------------
  currentUser: Signal<User> = this.authStore.user;
  readonly editLongTermGoals = output<boolean>();
  
  /** The current signed in user. */
 // currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------
  onEdit(isEditState: boolean): void {
    this.snackBar.open('Editing Long-term Goals', 'Close', {
      duration: 5000,
    })

    this.editLongTermGoals.emit(isEditState);
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
