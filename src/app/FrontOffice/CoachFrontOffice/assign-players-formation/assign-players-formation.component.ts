import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JoueurService } from 'src/app/services/serviceAdminClub/serviceJoueur/joueur.service';
import { FormationService } from 'src/app/services/serviceCoatch/serviceformation/formation.service';
import { Joueurs } from 'src/core/models/joueur';

@Component({
  selector: 'app-assign-players-formation',
  imports: [CommonModule],
  templateUrl: './assign-players-formation.component.html',
  styleUrl: './assign-players-formation.component.css'
})
export class AssignPlayersFormationComponent implements OnInit {
  @Input() formation: any

  successMessage: string = '';
    errorMessage: string = '';

  selectedPlayers: number[] = []; // Nouveau tableau pour stocker les IDs des joueurs sélectionnés
  filteredJoueurs: Joueurs[] = [];
  loading: boolean = true;
  
  // View mode toggle
  viewMode: 'card' | 'list' = 'card';
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 1;
  joueurs: Joueurs[] = [];

  constructor(private serv: JoueurService,private affecService: FormationService , private rout: Router) {}

  ngOnInit(): void {
    this.getJoueurs();
  }

  getJoueurs(): void {
    this.loading = true;
    this.serv.getAllJoueursALA().subscribe(
      data => {
        this.joueurs = data;
        this.filteredJoueurs = [...this.joueurs];
        this.calculateTotalPages();
        this.loading = false;
      },
      error => {
        console.error('Erreur lors du chargement des joueurs:', error);
        this.loading = false;
      }
    );
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredJoueurs.length / this.itemsPerPage);
  }

  getPageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Cette propriété getter retourne les joueurs pour la page actuelle
  get paginatedJoueurs(): Joueurs[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredJoueurs.slice(startIndex, startIndex + this.itemsPerPage);
  }

  searchPlayers(term: string): void {
    if (!term) {
      this.filteredJoueurs = [...this.joueurs];
    } else {
      term = term.toLowerCase();
      this.filteredJoueurs = this.joueurs.filter(joueur => 
        (joueur.nameUsers + ' ' + joueur.prenomUser).toLowerCase().includes(term) || 
        joueur.nameUsers.toLowerCase().includes(term) || 
        joueur.prenomUser.toLowerCase().includes(term) ||
        joueur.posteJoueur.toLowerCase().includes(term) ||
        joueur.emailUser.toLowerCase().includes(term)
      );
    }
    this.currentPage = 1; // Retour à la première page après une recherche
    this.calculateTotalPages();
  }

  // Toggle view mode between card and list
  toggleViewMode(mode: 'card' | 'list'): void {
    this.viewMode = mode;
  }




  togglePlayerSelection(playerId: number): void {
    const index = this.selectedPlayers.indexOf(playerId);
    if (index > -1) {
      this.selectedPlayers.splice(index, 1); // Retirer l'ID si déjà présent
    } else {
      this.selectedPlayers.push(playerId); // Ajouter l'ID s'il n'est pas présent
    }
    console.log('Joueurs sélectionnés:', this.selectedPlayers);
  }

  isPlayerSelected(playerId: number): boolean {
    return this.selectedPlayers.includes(playerId);
  }



  assignSelectedPlayers(): void {
    console.log('Assigner les joueurs avec les IDs:', this.selectedPlayers , 'de la formation', this.formation.idFormation);
    this.affecService.affecterjoueursAformation( this.formation.idFormation, this.selectedPlayers).subscribe({
      next: () => {
        this.successMessage = 'Players assigned with success !';
        this.errorMessage = '';
        window.location.reload();
      },
      error: () => {
        this.errorMessage = 'Error when assigned ';
        this.successMessage = '';
      }
    });
  }



  isPlayerInFormation(playerId: number): boolean {
    return this.formation?.joueurs?.some((j: { idUser: number }) => j.idUser === playerId);
  }
  
  
}