import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, Input, ViewChild, type ElementRef, type OnChanges } from "@angular/core";
import { RapportService } from "src/app/services/serviceAnalyste/gerer-rapport/rapport.service";

// Import models
import type { Joueurs } from "src/core/models/joueur";
import type { Rapport } from "src/core/models/rapport";

@Component({
  selector: "app-player-rapport-details",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./player-rapport-details.component.html",
  styleUrl: "./player-rapport-details.component.css",
})
export class PlayerRapportDetailsComponent implements OnChanges {
  @Input() joueur: Joueurs | null = null;
  @Input() rapportId: number | null = null;
  @ViewChild("playerPanel") playerPanel!: ElementRef;

  selectedRapport: Rapport | null = null;
  rapports: Rapport[] = [];
  similarPlayers: Joueurs[] = [];

  constructor(
    private rapportService: RapportService,
    private http: HttpClient,
  ) {}

  ngOnChanges() {
    console.log("Données reçues par le composant:", this.joueur, this.rapportId);

    if (this.joueur && this.joueur.numeroJoueur && this.rapportId) {
      this.loadPlayerAndReport();

      if (this.joueur.posteJoueur) {
        this.loadSimilarPlayers(this.joueur.posteJoueur, this.joueur.numeroJoueur);
      }
    } else if (this.joueur && this.joueur.numeroJoueur && this.joueur.rapports && this.joueur.rapports.length > 0) {
      this.rapportId = this.joueur.rapports[0].idRapport;
      this.loadPlayerAndReport();

      if (this.joueur.posteJoueur) {
        this.loadSimilarPlayers(this.joueur.posteJoueur, this.joueur.numeroJoueur);
      }
    } else {
      this.rapports = [];
      this.selectedRapport = null;
      this.similarPlayers = [];
    }
  }

  loadPlayerAndReport() {
    if (!this.joueur || !this.joueur.numeroJoueur || !this.rapportId) {
      console.error("Impossible de charger les données: joueur ou rapport non défini");
      return;
    }

    this.rapportService.findJoueursRapports(this.rapportId, this.joueur.numeroJoueur).subscribe(
      (response: any) => {
        if (response) {
          if (Array.isArray(response) && response.length > 0) {
            this.rapports = response;
            const specificReport = this.rapports.find((r) => r.idRapport === this.rapportId);
            this.selectedRapport = specificReport || this.rapports[0];
          } else if (typeof response === "object" && response.idRapport) {
            this.selectedRapport = response as Rapport;
            this.rapports = [this.selectedRapport];
          }

          if (this.selectedRapport && this.selectedRapport.joueurrapport) {
            this.joueur = {
              ...this.joueur,
              ...this.selectedRapport.joueurrapport,
            };
          }

          console.log("Rapport sélectionné:", this.selectedRapport);
        } else {
          this.rapports = [];
          this.selectedRapport = null;
        }
      },
      (error) => {
        console.error("Erreur lors du chargement des données:", error);
        this.rapports = [];
        this.selectedRapport = null;
      },
    );
  }

  // ✅ Correction ici
  loadSimilarPlayers(poste: string, numero: number) {
    this.rapportService.getSimilarRapports(poste, numero).subscribe(
      (response: Rapport[]) => {
        console.log("Réponse brute des joueurs similaires:", response);

        const uniquePlayers = new Map<number, Joueurs>();

        if (Array.isArray(response)) {
          response.forEach((rapport) => {
            const joueur = rapport.joueursrapport || rapport.joueurrapport;

            if (joueur && joueur.idUser && !uniquePlayers.has(joueur.idUser)) {
              uniquePlayers.set(joueur.idUser, joueur);
            }
          });

          this.similarPlayers = Array.from(uniquePlayers.values());
          console.log("Joueurs similaires filtrés:", this.similarPlayers);
        } else {
          console.warn("La réponse n'est pas un tableau:", response);
          this.similarPlayers = [];
        }
      },
      (error) => {
        console.error("Erreur lors du chargement des joueurs similaires:", error);
        this.similarPlayers = [];
      }
    );
  }

  closePanel() {
    this.joueur = null;
    this.rapportId = null;
    this.rapports = [];
    this.selectedRapport = null;
    this.similarPlayers = [];
  }

  selectRapport(rapport: Rapport) {
    this.selectedRapport = rapport;
    console.log("Nouveau rapport sélectionné:", this.selectedRapport);
  }

  getStatusClass(status: string): string {
    if (!status) return "";

    status = status.toLowerCase();
    if (status.includes("excellent") || status.includes("bon")) {
      return "status-good";
    } else if (status.includes("moyen")) {
      return "status-average";
    } else if (status.includes("mauvais") || status.includes("faible")) {
      return "status-bad";
    }
    return "";
  }

  getInjuryClass(injury: string): string {
    if (!injury) return "";

    injury = injury.toLowerCase();
    if (injury.includes("aucune") || injury.includes("non")) {
      return "status-good";
    } else if (injury.includes("légère") || injury.includes("mineure")) {
      return "status-average";
    } else if (injury.includes("grave") || injury.includes("sérieuse")) {
      return "status-bad";
    }
    return "";
  }
}
