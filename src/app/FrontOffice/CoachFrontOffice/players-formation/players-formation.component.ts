import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AssignPlayersFormationComponent } from "../assign-players-formation/assign-players-formation.component";
import { FormationService } from 'src/app/services/serviceCoatch/serviceformation/formation.service';
import { StatistiqueIndiv } from 'src/core/models/StatistiqueIndiv';
import { StatisindivService } from 'src/app/services/serviceAnalyste/statistique-indiv/statisindiv.service';

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

  constructor(private serF:FormationService, private statistiqueService: StatisindivService){}
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









isModalOpenStatistic = false;
 numeroPlayer:number=0;
 nameUsers:string='';
  showStatistic(numeroJoueur: number, nameUsers:string): void {
    this.isModalOpenStatistic = true;
    console.log("Statistique du joueur :", numeroJoueur);
    console.log(numeroJoueur);
    this.numeroPlayer=numeroJoueur;
    this.nameUsers=nameUsers;

    this.showStatisticdunjoueur(numeroJoueur);
  }

 



  statistiques: StatistiqueIndiv[] = [];

  showStatisticdunjoueur(numeroJoueur: number | undefined): void {
    if (numeroJoueur !== undefined) {
      this.statistiqueService.getStatIndivByNumeroJoueur(numeroJoueur).subscribe(
        (data) => {
          this.statistiques = data;
          this.isModalOpenStatistic = true;
        },
        (error) => {
          console.error('Erreur lors de la récupération des statistiques:', error);
        }
      );
    }
  }



  closeModalStatistic(): void {
    this.isModalOpenStatistic = false;
    this.statistiques = []; // Réinitialisation de la liste des statistiques
  }
}
