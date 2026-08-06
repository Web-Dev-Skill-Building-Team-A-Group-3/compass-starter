import { trigger, group, query, animateChild, state, style, animate, transition } from '@angular/animations';

export const WeeklyGoalsItemAnimations = [
  trigger('completionAnimation', [
    transition('* <=> *', animate('150ms')),
  ]),
];
