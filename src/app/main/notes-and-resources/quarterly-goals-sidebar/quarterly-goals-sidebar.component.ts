import { Component, OnInit, ChangeDetectionStrategy, input, inject, WritableSignal, Signal, signal, computed, effect, Inject, Injector } from '@angular/core';
import { QuarterlyGoalsSidebarAnimations } from './quarterly-goals-sidebar.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { MatDivider } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { QuarterlyGoalStore } from '../../../core/store/quarterly-goal/quarterly-goal.store';
import { QuarterlyGoal } from '../../../core/store/quarterly-goal/quarterly-goal.model';
import { WeeklyGoalStore } from '../../../core/store/weekly-goal/weekly-goal.store';
import { WeeklyGoal } from '../../../core/store/weekly-goal/weekly-goal.model';
import { HashtagStore } from '../../../core/store/hashtag/hashtag.store';
import { Hashtag } from '../../../core/store/hashtag/hashtag.model';
import { MatSnackBar, MatSnackBarModule, } from '@angular/material/snack-bar';
import { QueryParams, QueryOptions } from '../../../core/store/app.model';
import { QuarterlySidebarItemComponent } from './quarterly-sidebar-item/quarterly-sidebar-item.component';

@Component({
  selector: 'app-quarterly-goals-sidebar',
  templateUrl: './quarterly-goals-sidebar.component.html',
  styleUrls: ['./quarterly-goals-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: QuarterlyGoalsSidebarAnimations,
  standalone: true,
  imports: [
    MatDivider,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    QuarterlySidebarItemComponent,
  ],
})

export class QuarterlyGoalsSidebarComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly quarterlyGoalStore = inject(QuarterlyGoalStore);
  private readonly snackBar = inject(MatSnackBar);
  
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;
  /** The quarterly goal's id from the URL, passed down by the parent. */
  readonly goalId: Signal<string> = input.required<string>();

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);
  /** Whether the "add a weekly goal" input is currently open. */
  readonly addingGoal: WritableSignal<boolean> = signal(false);
  /** The input text for a new goal. */
  readonly newGoalText: WritableSignal<string> = signal('');

  // --------------- COMPUTED DATA -----------------------

  /** The quarterly goal for this page, selected by goalId. */
  readonly quarterlyGoal: Signal<QuarterlyGoal> = computed(() =>
    this.quarterlyGoalStore.selectFirst([['__id', '==', this.goalId()]], {}),
  );
  
  /** Shows the signed in user's quarterly goals that aren't deleted, empty if not signed in. */
  readonly quarterlyGoals: Signal<QuarterlyGoal[]> = computed(() => {
    const userId = this.currentUser()?.__id;
    if (!userId) {
      return [];
    }
    // Only this user's goals, skipping deleted ones
    const queryParams: QueryParams = [
      ['__userId', '==', userId],
      ['_deleted', '!=', true],
    ];
    // Sort by each goal's order
    const queryOptions: QueryOptions = {
      orderBy: 'order',
    };
    return this.quarterlyGoalStore.selectEntities(
      queryParams,
      queryOptions,
    );
  });

  // --------------- EVENT HANDLING ----------------------

  /** Opens the "add a weekly goal" input with empty text. */
  addGoal(): void {
    if (this.addingGoal() || this.loading()) {
      return;
    }

    this.newGoalText.set('');
    this.addingGoal.set(true);
  }

  /** Updates the newGoalText for a new goal input from the user. */
  onNewGoalInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.newGoalText.set(input.value);
  }

  /** Closes the new goal input and clear its input. */
  cancelNewGoal(): void {
    this.newGoalText.set('');
    this.addingGoal.set(false);
  }

  /** Saves the new weekly goal if there is an input then closes the input. */
  async saveNewGoal(): Promise<void> {
    if (!this.addingGoal() || this.loading()) {
      return;
    }
    const text = this.newGoalText().trim();
    if (!text) {
      this.cancelNewGoal();
      return;
    }
    const userId = this.currentUser()?.__id;
    const nextOrder =
      this.quarterlyGoals().reduce(
        (largestOrder, goal) =>
          Math.max(largestOrder, goal.order),
        -1,
      ) + 1;
    const newQuarterlyGoal = {
      __userId: userId,
      __hashtagId: this.goalId(),
      text,
      order: nextOrder,
      completed: false,
    };
    this.loading.set(true);
    this.addingGoal.set(false);
    try {
      await this.quarterlyGoalStore.add(newQuarterlyGoal);
      this.newGoalText.set('');
    } finally {
      this.loading.set(false);
    }
  }

  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
    const userId = this.currentUser()?.__id;
    if (!userId) {
      return;
    }
    this.quarterlyGoalStore.load(
      [
        ['__userId', '==', userId],
      ],
      {
        orderBy: 'order',
      },
    );
  }
}
