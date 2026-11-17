import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { QuarterlyGoalsHeaderAnimations } from './quarterly-goals-header.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-quarterly-goals-header',
  templateUrl: './quarterly-goals-header.component.html',
  styleUrls: ['./quarterly-goals-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: QuarterlyGoalsHeaderAnimations,
  standalone: true,
  imports: [],
})
export class QuarterlyGoalsHeaderComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  private snackBar = inject(MatSnackBar);
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;
  editQuart = output<boolean>();
  // --------------- LOCAL UI STATE ----------------------

  
  // --------------- COMPUTED DATA -----------------------
  loading: WritableSignal<boolean> = signal(false);
  // --------------- EVENT HANDLING ----------------------
  /**
  * @param isEdState: True if editing current goals, false if adding a fresh row
  */
  onEdit(isEdState: boolean): void {
    this.snackBar.open('Opening Quarterly Goals Modal', 'Close', {
      duration: 5000
    });
    this.editQuart.emit(isEdState);
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
