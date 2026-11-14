import { Component, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, effect, Inject, Injector } from '@angular/core';
import { QuarterlySidebarItemAnimations } from './quarterly-sidebar-item.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDivider } from '@angular/material/divider';
import { WeeklyGoal } from '../../../../core/store/weekly-goal/weekly-goal.model';

@Component({
  selector: 'app-quarterly-sidebar-item',
  templateUrl: './quarterly-sidebar-item.component.html',
  styleUrls: ['./quarterly-sidebar-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: QuarterlySidebarItemAnimations,
  standalone: true,
  imports: [
    MatCheckbox,
    MatDivider,
  ],
})
export class QuarterlySidebarItemComponent {
  readonly authStore = inject(AuthStore);
  // --------------- INPUTS AND OUTPUTS ------------------
  /** The weekly goal this item displays, passed from the parent */
  readonly goal = input.required<WeeklyGoal>();
  /** Emit to parent the goal's new completed state when user toggles its checkbox */
  readonly completedChange = output<boolean>();

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
}
