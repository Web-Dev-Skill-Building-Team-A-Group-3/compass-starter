import { Component, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { QuarterlyGoalsHeaderAnimations } from './quarterly-goals-header.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';

@Component({
  selector: 'app-quarterly-goals-header',
  templateUrl: './quarterly-goals-header.component.html',
  styleUrls: ['./quarterly-goals-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: QuarterlyGoalsHeaderAnimations,
  standalone: true,
  imports: [],
})
export class QuarterlyGoalsHeaderComponent {
  readonly authStore = inject(AuthStore);
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  /** Emits to the parent whether the user is editing current goals(true) or adding a new row(false). */
  editQuart = output<boolean>();
  // --------------- LOCAL UI STATE ----------------------
  
  loading: WritableSignal<boolean> = signal(false);
  // --------------- COMPUTED DATA -----------------------
  
  // --------------- EVENT HANDLING ----------------------
  /**
  * @param isEdState: True if editing current goals, false if adding a fresh row
  */
  onEdit(isEdState: boolean): void {
    this.editQuart.emit(isEdState);
  }
  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  
}
