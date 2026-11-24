import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { WeeklyGoalsHeaderAnimations } from './weekly-goals-header.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { startOfWeek, endOfWeek } from 'src/app/core/utils/time.utils';


@Component({
  selector: 'app-weekly-goals-header',
  templateUrl: './weekly-goals-header.component.html',
  styleUrls: ['./weekly-goals-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: WeeklyGoalsHeaderAnimations,
  standalone: true,
  imports: [
    
  ],
})
export class WeeklyGoalsHeaderComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  private readonly snackBar = inject(MatSnackBar);
  
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  /** Emits when the user clicks on the edit button. */
  editClicked = output<boolean>();

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  // --------------- COMPUTED DATA -----------------------

  /** Makes the startofWeek() helper function available to use in the HTML */
  readonly startOfWeek = startOfWeek;

  /** Makes the endofWeek() helper function available to use in the HTML */
  readonly endOfWeek = endOfWeek;

  // --------------- EVENT HANDLING ----------------------

  /** Displays a message to the user that the edit icon has been clicked. */
  pencilClick() {
    this.snackBar.open('Pencil Icon has been clicked', '',
      { duration: 1000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      }
    );
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
