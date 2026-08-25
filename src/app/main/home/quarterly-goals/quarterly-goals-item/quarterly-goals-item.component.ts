import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { QuarterlyGoalsItemAnimations } from './quarterly-goals-item.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { WeeklyGoalData } from '../../home.model';
import { QuarterlyGoalsData } from '../../home.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-quarterly-goals-item',
  templateUrl: './quarterly-goals-item.component.html',
  styleUrls: ['./quarterly-goals-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: QuarterlyGoalsItemAnimations,
  standalone: true,
  imports: [
    MatCheckbox,
    MatProgressSpinner
  ],
})
  
export class QuarterlyGoalsItemComponent implements OnInit {
  readonly authStore = inject(AuthStore);

  
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;
  goal = input<QuarterlyGoalsData>();
  readonly goalToggled = output<QuarterlyGoalsData>();
  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);
  isChecked: boolean = false;

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------
  checkGoal(goal: QuarterlyGoalsData): void {
    goal.completed = !goal.completed;
  
    this.snackBar.open(
      goal.completed ? 'Marked goal as complete' : 'Marked goal as incomplete',
      '',
      {
        duration: 3000,
        verticalPosition: 'bottom',
        horizontalPosition: 'center',
      },
    );
    this.goalToggled.emit(goal);
  }

  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    private snackBar: MatSnackBar,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
  }
}
