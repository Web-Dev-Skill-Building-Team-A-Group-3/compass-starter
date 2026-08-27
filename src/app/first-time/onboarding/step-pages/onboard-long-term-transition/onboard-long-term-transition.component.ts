import { Component, OnInit, ChangeDetectionStrategy, output, inject, WritableSignal, Signal, signal, Inject, Injector } from '@angular/core';
import { OnboardLongTermTransitionAnimations } from './onboard-long-term-transition.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-onboard-long-term-transition',
  templateUrl: './onboard-long-term-transition.component.html',
  styleUrls: ['./onboard-long-term-transition.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: OnboardLongTermTransitionAnimations,
  standalone: true,
  imports: [
    MatButtonModule,
  ],
})
export class OnboardLongTermTransitionComponent implements OnInit {
  readonly authStore = inject(AuthStore);

  // --------------- INPUTS AND OUTPUTS ------------------

  /** Emitted when the user clicks Next to navigate to step 3. */
  next = output<void>();

  /** Emitted when the user clicks Back to return to step 1. */
  back = output<void>();

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  /** Handles clicking the next button to navigate to step 3. */
  onNext(): void {
    this.next.emit();
  }

  /** Handles clicking the back button to navigate to step 1. */
  onBack(): void {
    this.back.emit();
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

