import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { QuarterlyGoalsAnimations } from './quarterly-goals.animations';
import { User } from 'src/app/core/store/user/user.model';
import { AuthStore } from 'src/app/core/store/auth/auth.store';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { QuarterlyGoalsHeaderComponent } from './quarterly-goals-header/quarterly-goals-header.component';
import { Timestamp } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuarterlyGoalsItemComponent } from './quarterly-goals-item/quarterly-goals-item.component';
import { QuarterlyGoalsData} from '../home.model';

@Component({
  selector: 'app-quarterly-goals',
  templateUrl: './quarterly-goals.component.html',
  styleUrls: ['./quarterly-goals.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: QuarterlyGoalsAnimations,
  standalone: true,
  imports: [
    QuarterlyGoalsHeaderComponent,
    QuarterlyGoalsItemComponent
  ],
})
export class QuarterlyGoalsComponent implements OnInit {
  readonly authStore = inject(AuthStore);
  // --------------- INPUTS AND OUTPUTS ------------------

  /** The current signed in user. */
  currentUser: Signal<User> = this.authStore.user;

  // --------------- LOCAL UI STATE ----------------------

  /** Loading icon. */
  loading: WritableSignal<boolean> = signal(false);

  sampleData: QuarterlyGoalsData = {
    __id: 'wg1',
    __userId: 'test-user',
    __hashtagId: 'ht1',
    text: 'Apply to all internships',
    completed: false,
    order: 1,
    weeklyGoalsTotal: 3,
    weeklyGoalsComplete: 2,
    _createdAt: Timestamp.now(),
    _updatedAt: Timestamp.now(),
    _deleted: false,
    hashtag: {
      __id: 'ht1',
      __userId: 'test-user',
      name: 'apply-internships',
      color: '#2DBDB1',
      _createdAt: Timestamp.now(),
      _updatedAt: Timestamp.now(),
      _deleted: false,
    },
  };
  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------
  checkGoal(goal: QuarterlyGoalsData) {
    }

  // --------------- OTHER -------------------------------

  constructor(
    private snackBar: MatSnackBar,
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
  }
}
