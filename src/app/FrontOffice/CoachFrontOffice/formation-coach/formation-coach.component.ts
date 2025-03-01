import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JoueurService } from 'src/app/services/serviceAdminClub/serviceJoueur/joueur.service';
import { FormationService } from 'src/app/services/serviceCoatch/serviceformation/formation.service';
import { formation } from 'src/core/models/formation';
import { Joueurs } from 'src/core/models/joueur';

@Component({
    selector: 'app-formation-coach',
    templateUrl: './formation-coach.component.html',
    styleUrls: ['./formation-coach.component.css'],
    standalone: false
})
export class FormationCoachComponent implements OnInit {



   formation: formation[] = [];
   joueurs: Joueurs[] = [];

   showPopup = false; // Contrôle l'affichage de la popup   h
   selectedFormation: any = null;                         //h

  
    constructor(private coatchService: FormationService, private joueurservice:JoueurService) {}
  

    successMessage: string = '';
  errorMessage: string = '';

    ngOnInit(): void {
      this.getFormations();
    }
  
    getFormations(): void {
      this.coatchService.getAllFormation().subscribe(data => {
        this.formation = data;
      });
    }


    



    openPopup(formation: any) {
      this.selectedFormation = formation;
      this.showPopup = true;
    }
  
    closePopup() {
      this.showPopup = false;
    }


    showConfirmPopup = false;
    formationIdToDelete: number | null = null;
  
    // Fonction pour ouvrir le popup de confirmation
    openConfirmPopup(id: number) {
      this.formationIdToDelete = id;
      this.showConfirmPopup = true;
    }
  
    // Fonction pour fermer le popup
    closeConfirmPopup() {
      this.showConfirmPopup = false;
      this.formationIdToDelete = null;
    }
  
    // Confirmer la suppression
    confirmDelete() {
      if (this.formationIdToDelete !== null) {
        this.deleteFormation(this.formationIdToDelete);
        this.closeConfirmPopup();
      }
    }




    deleteFormation(id:any){
      this.coatchService.delFormation(id).subscribe(()=>{
        console.log("deleted Formation !!!!")
        window.location.reload()
      })
    }


    
    showPlayers(formationId: number): void {
      this.joueurservice.getJoueursByIdformation(formationId).subscribe(data => {
        this.joueurs = data;
      });
      console.log(`Show players for formation with ID: ${formationId}`);
    }

}
