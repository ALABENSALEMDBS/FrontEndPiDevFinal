import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-players-formation',
  imports: [CommonModule],
  templateUrl: './players-formation.component.html',
  styleUrl: './players-formation.component.css',
  animations: [
    trigger("slideInOut", [
      state(
        "in",
        style({
          transform: "translateX(0)",
        }),
      ),
      state(
        "out",
        style({
          transform: "translateX(100%)",
        }),
      ),
      transition("out => in", animate("300ms ease-in-out")),
      transition("in => out", animate("300ms ease-in-out")),
    ]),
  ],
})
export class PlayersFormationComponent {


  @Input() isOpen = false
  @Input() formation: any
  @Output() close = new EventEmitter<void>()

  closePanel(): void {
    this.close.emit()
  }
}
