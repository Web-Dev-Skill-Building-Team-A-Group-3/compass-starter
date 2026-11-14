import { Component, OnInit, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { DateTimeAnimations } from './date-time.animations';
import { BatchWriteService, BATCH_WRITE_SERVICE } from 'src/app/core/store/batch-write.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map, startWith } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: DateTimeAnimations,
  standalone: true,
  imports: [
    DatePipe,
  ],
})
export class DateTimeComponent {
  // --------------- INPUTS AND OUTPUTS ------------------

  // --------------- LOCAL UI STATE ----------------------
  
  /**
   * The current date and time.
   * Gets a new value every second.
   */
  currentDateTime = toSignal(
    interval(1000).pipe(
      startWith(0),
      map(() => new Date()),
    ),
    {
      initialValue: new Date(),
    },
  );

  // --------------- COMPUTED DATA -----------------------
  
  /**
   * Today's day of the month, from 1 to 31.
   */
  day = computed(() => this.currentDateTime().getDate());

  /**
   * The letters that go after the day number.
   * For example: 1st, 2nd, 3rd, 4th.
   * 11, 12 and 13 always end in "th".
   */
  suffix = computed(() => {
    const day = this.day();

    const lastDigits = day % 100;

    if (lastDigits >= 11 && lastDigits <= 13) {
      return 'th';
    }

    switch (day % 10) {
      case 1:
        return 'st';

      case 2:
        return 'nd';

      case 3:
        return 'rd';

      default:
        return 'th';
    }
  });
  
  

  // --------------- EVENT HANDLING ----------------------

  // --------------- OTHER -------------------------------

  constructor(
    private injector: Injector,
    @Inject(BATCH_WRITE_SERVICE) private batch: BatchWriteService,
  ) { }

  // --------------- LOAD AND CLEANUP --------------------
  
  ngOnInit(): void {
  }
}
