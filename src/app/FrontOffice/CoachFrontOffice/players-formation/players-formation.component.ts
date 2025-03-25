import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AssignPlayersFormationComponent } from "../assign-players-formation/assign-players-formation.component";
import { FormationService } from 'src/app/services/serviceCoatch/serviceformation/formation.service';

@Component({
  selector: 'app-players-formation',
  imports: [CommonModule, AssignPlayersFormationComponent],
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

  constructor(private serF:FormationService){}
    successMessage: string = '';
    errorMessage: string = '';
    showSuccessMessage: boolean = false
    showErrorMessage: boolean = false
  selectedFormation: any = null

  showPopup = false;

  isAssignOpen = false; // Contrôle l'affichage du composant Assign Players

  @Input() isOpen = false
  @Input() formation: any
  @Output() close = new EventEmitter<void>()


  closePanel(): void {
    this.close.emit()
    this.isOpen=false;
    this.isAssignOpen = false; // Fermer également assign
   // window.location.reload()
  }


  assignPlayer(idFormation: number)
{
  this.selectedFormation=this.formation;
  console.log("Assign player to formation:", this.formation?.nameFormation)
  this.showPopup = true;
  this.isAssignOpen = true;

}

openPanel() {
  this.isOpen = true;
}

closeAssignPanel() {
  this.isAssignOpen = false;
  this.showPopup = false;

}




removePlayerFromFormation(formationId: number, playerId: number)
{
    this.serF.dessaffecterJoueurAFormation(formationId, playerId).subscribe({
      next: () => {
        this.successMessage = 'Unassigned player successfully.';
        this.errorMessage = '';
        window.location.reload();

      },
      error: () => {
        this.errorMessage = 'Error when Unassigned player.';
        this.successMessage = '';

      }
    });
}





}
