import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { OnboardingAnimations } from './onboarding.animations';
import { User, OnboardingState } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { OrganizeQuarterlyGoalsComponent } from './step-pages/organize-quarterly-goals/organize-quarterly-goals.component';
import { UserStore } from 'src/app/core/store/user/user.store';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    OrganizeQuarterlyGoalsComponent,
  ],
  animations: OnboardingAnimations,
})
export class OnboardingComponent implements OnInit {
  authStore = inject(AuthStore);
  readonly userStore = inject(UserStore);
  
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The currently signed in user. */
  currentUser: Signal<User> = this.authStore.user;
  
  // --------------- LOCAL UI STATE ----------------------

  OnboardingState = OnboardingState;

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  async onOrganizeQuarterlyGoalsBack(): Promise<void> {
    const user = this.currentUser();
    if (user) {
      await this.userStore.update(user.__id, { onboardingState: OnboardingState.STEP_4 });
    }
  }

  async onOrganizeQuarterlyGoalsNext(): Promise<void> {
    const user = this.currentUser();
    if (user) {
      await this.userStore.update(user.__id, { onboardingState: OnboardingState.STEP_6 });
    }
  }

  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) {
  }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit() {
  }
}
