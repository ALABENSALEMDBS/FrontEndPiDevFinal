import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JoueurService } from 'src/app/services/serviceAdminClub/serviceJoueur/joueur.service';
import { Joueurs } from 'src/core/models/joueur';

@Component({
  selector: 'app-show-all-players',
  imports: [CommonModule],
  templateUrl: './show-all-players.component.html',
  styleUrl: './show-all-players.component.css'
})
export class ShowAllPlayersComponent implements OnInit {
  filteredJoueurs: Joueurs[] = [];
  loading: boolean = true;
  
  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 3;
  totalPages: number = 1;
  joueurs: Joueurs[] = [];

  constructor(private serv: JoueurService, private rout: Router) {}

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
}