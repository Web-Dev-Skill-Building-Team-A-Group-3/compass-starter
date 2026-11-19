import { Component, ChangeDetectionStrategy, input, output, inject, WritableSignal, Signal, signal, computed, Inject, Injector } from '@angular/core';
import { QuarterlySidebarItemAnimations } from './quarterly-sidebar-item.animations';
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
  
  // --------------- INPUTS AND OUTPUTS ------------------
  /** The weekly goal this item displays, passed from the parent */
  readonly goal = input.required<WeeklyGoal>();
  
  /** Emit to parent the goal's new completed state when user toggles its checkbox */
  readonly completedChange = output<boolean>();

  // --------------- LOCAL UI STATE ----------------------

  // --------------- COMPUTED DATA -----------------------

  // --------------- EVENT HANDLING ----------------------

  // --------------- OTHER -------------------------------

  // --------------- LOAD AND CLEANUP --------------------
}
