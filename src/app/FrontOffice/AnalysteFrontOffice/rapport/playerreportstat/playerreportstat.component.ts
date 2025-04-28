import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Rapport } from 'src/core/models/rapport';
import { seance } from 'src/core/models/seance';
import { sousgroup } from 'src/core/models/sousgroup';
import { Joueurs } from 'src/core/models/joueur';
import { RapportService } from 'src/app/services/serviceAnalyste/gerer-rapport/rapport.service';
import { JoueurService } from 'src/app/services/serviceAdminClub/serviceJoueur/joueur.service';

@Component({
  selector: 'app-playerreportstat',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './playerreportstat.component.html',
  styleUrls: ['./playerreportstat.component.css']
})
export class PlayerreportstatComponent implements OnInit {

  badReports: Rapport[] = [];
  bestPlayer: Rapport | null = null;
  suspectGoodStatePlayers: Rapport[] = [];
  
  // Filter variables
  selectedBadPlayerPoste: string = '';
  selectedBestPlayerPoste: string = '';
  selectedBestPlayerSeance: string = '';
  selectedBestPlayerGroupe: string = '';
  selectedSuspectPlayerPoste: string = '';

  // Filter options from database
  joueurs: Joueurs[] = [];
  seances: seance[] = [];
  sousGroupes: sousgroup[] = [];
  
  // Unique player positions extracted from joueurs
  playerPostes: string[] = [];

  // Loading states
  isLoadingBadReports: boolean = false;
  isLoadingBestPlayer: boolean = false;
  isLoadingSuspectPlayers: boolean = false;

  constructor(
    private rapportService: RapportService,
    private joueurService: JoueurService
  ) {}

  ngOnInit(): void {
    // Load filter options from database
    this.loadFilterOptions();
  }

  // Load all filter options from database
  loadFilterOptions(): void {
    // Load joueurs to extract positions
    this.joueurService.getAllJoueurs().subscribe({
      next: (data) => {
        this.joueurs = data;
        
        // Extract unique positions from joueurs
        const positionSet = new Set<string>();
        this.joueurs.forEach(joueur => {
          if (joueur.posteJoueur) {
            positionSet.add(joueur.posteJoueur);
          }
        });
        
        this.playerPostes = Array.from(positionSet);
        
        // Set default position values if positions are available
        if (this.playerPostes.length > 0) {
          this.selectedBadPlayerPoste = this.playerPostes[0];
          this.selectedBestPlayerPoste = this.playerPostes[0];
          this.selectedSuspectPlayerPoste = this.playerPostes[0];
          
          // Load initial data for positions
          this.loadBadPlayersByPoste(this.selectedBadPlayerPoste);
          this.loadSuspectPlayersWithGoodState(this.selectedSuspectPlayerPoste);
        }
      },
      error: (err) => console.error('Erreur chargement joueurs:', err)
    });

    // Load seances
    this.rapportService.getAllSeances().subscribe({
      next: (data) => {
        this.seances = data;
        if (this.seances.length > 0) {
          this.selectedBestPlayerSeance = this.seances[0].titleSeance;
        }
      },
      error: (err) => console.error('Erreur chargement séances:', err)
    });

    // Load sous-groupes
    this.rapportService.getAllSousGroupes().subscribe({
      next: (data) => {
        this.sousGroupes = data;
        if (this.sousGroupes.length > 0) {
          this.selectedBestPlayerGroupe = this.sousGroupes[0].nameSousGroup;
          
          // Load best player data after all filter options are loaded
          if (this.selectedBestPlayerPoste && this.selectedBestPlayerSeance && this.selectedBestPlayerGroupe) {
            this.loadBestPlayerByPosteSeanceSousGroupe(
              this.selectedBestPlayerPoste,
              this.selectedBestPlayerSeance,
              this.selectedBestPlayerGroupe
            );
          }
        }
      },
      error: (err) => console.error('Erreur chargement sous-groupes:', err)
    });
  }

  // 1. Joueurs avec mauvaises performances par poste
  loadBadPlayersByPoste(poste: string) {
    this.selectedBadPlayerPoste = poste;
    this.isLoadingBadReports = true;
    
    this.rapportService.getBadReportsByPoste(poste).subscribe({
      next: (data) => {
        this.badReports = data;
        this.isLoadingBadReports = false;
      },
      error: (err) => {
        console.error('Erreur badReports:', err);
        this.isLoadingBadReports = false;
      }
    });
  }

  // 2. Meilleur joueur filtré par poste + séance + sous-groupe
  loadBestPlayerByPosteSeanceSousGroupe(poste: string, seance: string, groupe: string) {
    this.selectedBestPlayerPoste = poste;
    this.selectedBestPlayerSeance = seance;
    this.selectedBestPlayerGroupe = groupe;
    this.isLoadingBestPlayer = true;
    
    this.rapportService.getBestByPosteAndSeance(poste, seance).subscribe({
      next: (data) => {
        this.bestPlayer = data;
        this.isLoadingBestPlayer = false;
      },
      error: (err) => {
        console.error('Erreur bestPlayer:', err);
        this.isLoadingBestPlayer = false;
        this.bestPlayer = null;
      }
    });
  }

  // 3. Joueurs suspects mais en état "GOOD"
  loadSuspectPlayersWithGoodState(poste: string) {
    this.selectedSuspectPlayerPoste = poste;
    this.isLoadingSuspectPlayers = true;
    
    this.rapportService.getRapportsSuspectsEtatGood(poste).subscribe({
      next: (data) => {
        this.suspectGoodStatePlayers = data;
        // Ensure we have complete player data for each report
        this.ensurePlayerDataForSuspects();
        this.isLoadingSuspectPlayers = false;
      },
      error: (err) => {
        console.error('Erreur suspectGoodState:', err);
        this.isLoadingSuspectPlayers = false;
      }
    });
  }

  // Ensure we have complete player data for suspect players
  ensurePlayerDataForSuspects(): void {
    // For each suspect player report that doesn't have complete player data
    this.suspectGoodStatePlayers.forEach((report, index) => {
      // If the report has a player ID but missing player data
      if (report.joueursrapport?.idUser && 
          (!report.joueursrapport.nameUsers || !report.joueursrapport.prenomUser)) {
        
        // Find the complete player data from our joueurs array
        const completePlayerData = this.joueurs.find(j => j.idUser === report.joueursrapport?.idUser);
        
        if (completePlayerData) {
          // Update the player data in the report
          this.suspectGoodStatePlayers[index].joueursrapport = completePlayerData;
        }
      }
    });
  }

  // Helper method to get stat class based on value
  getStatClass(value: number): string {
    if (value <= 4) return 'stat-low';
    if (value <= 7) return 'stat-medium';
    return 'stat-high';
  }

  // Calculate overall rating based on player stats
  calculateOverallRating(player: Rapport): number {
    if (!player) return 0;
    
    const stats = [
      player.speedRapport,
      player.accelerationRapport,
      player.endurance,
      player.strength,
      player.power,
      player.muscularEndurance,
      player.agility,
      player.balance,
      player.coordination,
      player.explosiveness,
      player.reactionTime,
      player.reactivity
    ];
    
    // Filter out undefined values
    const validStats = stats.filter(stat => stat !== undefined);
    
    if (validStats.length === 0) return 0;
    
    // Calculate average and round to nearest integer
    const sum = validStats.reduce((acc, curr) => acc + curr, 0);
    return Math.round(sum / validStats.length);
  }

  // Get player initials safely
  getPlayerInitials(player: Joueurs | undefined): string {
    if (!player || !player.nameUsers || !player.prenomUser) return 'NA';
    return `${player.nameUsers.charAt(0)}${player.prenomUser.charAt(0)}`;
  }

  // Get player full name safely
  getPlayerFullName(player: Joueurs | undefined): string {
    if (!player) return 'Joueur Inconnu';
    return `${player.nameUsers || ''} ${player.prenomUser || ''}`.trim() || 'Joueur Inconnu';
  }

  // Check if player has poor performance metrics
  hasPoorPerformance(report: Rapport): boolean {
    // Define threshold for poor performance (e.g., average below 5)
    const threshold = 5;
    const metrics = [report.speedRapport, report.accelerationRapport, report.endurance];
    const validMetrics = metrics.filter(m => m !== undefined);
    if (validMetrics.length === 0) return false;
    
    const average = validMetrics.reduce((sum, val) => sum + val, 0) / validMetrics.length;
    return average < threshold;
  }
}
