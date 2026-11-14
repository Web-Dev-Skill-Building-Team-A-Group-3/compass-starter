import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { NotesHeaderAnimations } from './notes-header.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { QuarterlyGoalStore } from 'src/app/core/store/quarterly-goal/quarterly-goal.store';
import { LongTermGoalStore } from 'src/app/core/store/long-term-goal/long-term-goal.store';
import { HashtagStore, LoadHashtag, StreamHashtag } from 'src/app/core/store/hashtag/hashtag.store';
import { QuarterlyGoal } from 'src/app/core/store/quarterly-goal/quarterly-goal.model';
import { LongTermGoal } from 'src/app/core/store/long-term-goal/long-term-goal.model';
import { Hashtag } from 'src/app/core/store/hashtag/hashtag.model';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-notes-header',
  templateUrl: './notes-header.component.html',
  styleUrls: ['./notes-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: NotesHeaderAnimations,
  standalone: true,
  imports: [
    CommonModule,
    
  ],
})
export class NotesHeaderComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  readonly longTermGoalStore = inject(LongTermGoalStore);
  readonly quarterlyGoalStore = inject(QuarterlyGoalStore);
  readonly hashtagStore = inject(HashtagStore);
  private readonly router = inject(Router);

  // --------------- INPUTS AND OUTPUTS ------------------
  /** Input taken from the URL passed down by the page. */
  goalId = input.required<string>();

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------
  /** Loading icon. **/
  loading: WritableSignal<boolean> = signal(false);
  
  // --------------- COMPUTED DATA -----------------------
  /** Selects the longTermGoal data if it the page is longTermGoals. */
  longTermGoal: Signal<LongTermGoal> = computed(() =>
    this.longTermGoalStore.selectFirst([['__id', '==', this.goalId()]], {}),
  );

  /** Selects the quarterlyGoal data if it the page is quarterlyGoal. */
  quarterlyGoal: Signal<QuarterlyGoal> = computed(() =>
    this.quarterlyGoalStore.selectFirst([['__id', '==', this.goalId()]], {}),
  );

  /** Checks if the page is LongTermGoals by comparing the long term goal id to goalId. */
  // TODO (3/4): fix lint style in this file: missing semicolon on this line, spacing around braces and commas in exit() and ngOnInit, unused imports
  isLongTermGoal: Signal<boolean> = computed(() =>  this.longTermGoal()?.__id === this.goalId())

  /** Hashtag for the quarterly goal variant. */
  hashtag: Signal<Hashtag> = computed(() => {
    const qg = this.quarterlyGoal();
    return qg ? this.hashtagStore.selectFirst([['__id', '==', qg.__hashtagId]], {}): null;
  });
  // --------------- EVENT HANDLING ----------------------
  /** Closes the note page and return back to dashboard */
  exit(): void{
    this.router.navigate(['/home']);
  }
  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  /** Load both goals since goalId can be either longTermGoal or quarterlyGoal. QuarterlyGoal also loads hashtag */
  async ngOnInit(): Promise<void> {
    const userId = this.currentUser().__id;
    const goalId = this.goalId();

    // We don't know yet which type the id is, so query both stores;
    // only one will return a match, and selectFirst() above decides the variant.
    await Promise.all([
      this.longTermGoalStore.load(
        [['__id', '==', goalId], ['__userId', '==', userId]], {}),
      this.quarterlyGoalStore.load(
        [['__id', '==', goalId], ['__userId', '==', userId]],{},
        // nested load with a single '__id' equality so app.store can batch it
        (qg) => [LoadHashtag.create(this.hashtagStore, [['__id', '==', qg.__hashtagId]], {})],
        {loading: this.loading}
      ),
    ]);
  }
}
