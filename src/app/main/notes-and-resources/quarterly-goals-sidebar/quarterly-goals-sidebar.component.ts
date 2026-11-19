import { Component, OnInit, ChangeDetectionStrategy, input, inject, WritableSignal, Signal, signal, computed, Inject, Injector, ElementRef, viewChild, afterNextRender } from '@angular/core';
import { QuarterlyGoalsSidebarAnimations } from './quarterly-goals-sidebar.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { MatDivider } from '@angular/material/divider';
import { QuarterlyGoalStore } from '../../../core/store/quarterly-goal/quarterly-goal.store';
import { QuarterlyGoal } from '../../../core/store/quarterly-goal/quarterly-goal.model';
import { WeeklyGoalStore } from '../../../core/store/weekly-goal/weekly-goal.store';
import { WeeklyGoal } from '../../../core/store/weekly-goal/weekly-goal.model';
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
    QuarterlySidebarItemComponent,
  ],
})

export class QuarterlyGoalsSidebarComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly weeklyGoalStore = inject(WeeklyGoalStore);
  readonly quarterlyGoalStore = inject(QuarterlyGoalStore);
  
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

  /** The new goal input element which is focused when it is first open. */
  readonly newGoalInput = viewChild<ElementRef<HTMLInputElement>>('newGoalInput');

  // --------------- COMPUTED DATA -----------------------

  /** The quarterly goal for this page, selected by goalId. */
  readonly quarterlyGoal: Signal<QuarterlyGoal> = computed(() =>
    this.quarterlyGoalStore.selectFirst([['__id', '==', this.goalId()]], {}),
  );

  /** This quarterly goal's weekly goals that aren't deleted, in order. */
  readonly weeklyGoals: Signal<WeeklyGoal[]> = computed(() =>
    this.weeklyGoalStore.selectEntities(
      [
        ['__quarterlyGoalId', '==', this.goalId()],
        ['_deleted', '!=', true],
      ],
      { orderBy: 'order' },
    ),
  );

  // --------------- EVENT HANDLING ----------------------
  
  /** Opens the "add a weekly goal" input with empty text and focuses it. */
  addGoal(): void {
    if (this.addingGoal() || this.loading()) {
      return;
    }

    this.newGoalText.set('');
    this.addingGoal.set(true);
    afterNextRender(() => this.newGoalInput()?.nativeElement.focus(), {
      injector: this.injector,
    });
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

  /** Saves a new weekly goal under this quarterly goal if text was entered. */
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
      this.weeklyGoals().reduce(
        (largestOrder, goal) =>
          Math.max(largestOrder, goal.order),
        -1,
      ) + 1;
    const newWeeklyGoal = {
      __userId: userId,
      __quarterlyGoalId: this.goalId(),
      __hashtagId: this.quarterlyGoal()?.__hashtagId,
      text,
      order: nextOrder,
      completed: false,
    };
    this.loading.set(true);
    this.addingGoal.set(false);
    try {
      await this.weeklyGoalStore.add(newWeeklyGoal);
      this.newGoalText.set('');
    } finally {
      this.loading.set(false);
    }
  }
  
  /** Saves a weekly goal's new completed state when its checkbox is toggled. */
  async toggleCompleteChange(goal: WeeklyGoal, completed: boolean): Promise<void> {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    try {
      await this.weeklyGoalStore.update(goal.__id, { completed });
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
  
  /** Loads the user's quarterly goals and this quarterly goal's weekly goals. */
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
    this.weeklyGoalStore.load(
      [
        ['__userId', '==', userId],
        ['__quarterlyGoalId', '==', this.goalId()],
      ],
      { orderBy: 'order' },
    );
  }
}
