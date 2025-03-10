import { Component } from '@angular/core';
import { RapportService } from 'src/app/services/serviceAnalyste/gerer-rapport/rapport.service';
import { Rapport } from 'src/core/models/rapport';
import { Joueurs } from 'src/core/models/joueur';
import { JoueurService } from 'src/app/services/serviceAdminClub/serviceJoueur/joueur.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { UpdateRapportComponent } from '../update-rapport/update-rapport.component';
import { PlayerRapportDetailsComponent } from '../player-rapport-details/player-rapport-details.component';

@Component({
  selector: 'app-list-rapport',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, UpdateRapportComponent, PlayerRapportDetailsComponent],
  templateUrl: './list-rapport.component.html',
  styleUrl: './list-rapport.component.css'
})
export class ListRapportComponent {

  showPopup = false; 
  selectedRapport: any = null;  
  showAddPopup = false;

  Rapport: Rapport[] = [];
  Joueurs: Joueurs[] = []; // Liste des joueurs avec un rapport
  
  showConfirmPopup = false;
  RapportIdToDelete: number | null = null;
    
  constructor(private RapportService: RapportService, private joueurService: JoueurService) {}

  ngOnInit(): void {
    this.getRapport();
  }

  // Récupérer tous les rapports et mettre à jour les joueurs associés
  getRapport(): void {
    this.RapportService.getAllRapport().subscribe(data => {
      this.Rapport = data;
      this.getJoueurs();
    });
  }

  getJoueurs(): void {
    this.joueurService.getAllJoueurs().subscribe(data => {
      this.Joueurs = data.filter(joueur => joueur.rapport !== null);
    });
  }
  
  openPopup(Rapport: any) {
    this.selectedRapport = Rapport;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  openAddPopup() {
    this.showAddPopup = true;
  }

  closeAddPopup() {
    this.showAddPopup = false;
  }

  // Ouvrir et fermer le popup de confirmation
  openConfirmPopup(id: number) {
    this.RapportIdToDelete = id;
    this.showConfirmPopup = true;
  }

  closeConfirmPopup() {
    this.showConfirmPopup = false;
    this.RapportIdToDelete = null;
  }

  // Confirmer la suppression d'un rapport
  confirmDelete() {
    if (this.RapportIdToDelete !== null) {
      this.deleteRapport(this.RapportIdToDelete);
      this.closeConfirmPopup();
    }
  }

  // Supprimer un rapport et mettre à jour la liste
  deleteRapport(id: number) {
    this.RapportService.delRapport(id).subscribe(() => {
      console.log("Rapport supprimé !!!!");

      this.Rapport = this.Rapport.filter(r => r.idRapport !== id);
      this.Joueurs = this.Joueurs.filter(j => j.rapport && j.rapport.idRapport !== id);
    });
  }

  selectedPlayer: Joueurs | null = null;
  showPlayersPanel = false; // État du panneau

  openPlayersPanel(joueur: Joueurs): void {
    if (this.selectedPlayer === joueur) {
      this.selectedPlayer = null; // Réinitialise si c'est le même joueur
      setTimeout(() => {
        this.selectedPlayer = joueur; // Réassigne après un petit délai
      }, 50); // 50ms suffisent pour déclencher la détection de changement
    } else {
      this.selectedPlayer = joueur;
    }
  }
  

  closePlayersPanel(): void {
    this.showPlayersPanel = false; // Ferme le panneau
  }
}
