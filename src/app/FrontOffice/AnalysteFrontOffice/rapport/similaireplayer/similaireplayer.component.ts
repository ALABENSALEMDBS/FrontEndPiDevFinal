import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Rapport } from "src/core/models/rapport"
import { ActivatedRoute, Router } from "@angular/router"
import { RapportService } from "src/app/services/serviceAnalyste/gerer-rapport/rapport.service"


@Component({
  selector: "app-similaireplayer",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./similaireplayer.component.html",
  styleUrl: "./similaireplayer.component.css",
})
export class SimilaireplayerComponent implements OnInit {
  similarReports: Rapport[] = []
  poste = ""
  numero = 0
  isLoading = true
  error: string | null = null

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rapportService: RapportService,
  ) {}

  ngOnInit(): void {
    // Get the position and number from the query parameters
    this.route.queryParams.subscribe((params) => {
      this.poste = params["poste"]
      this.numero = +params["numero"] // Convert to number

      if (this.poste && this.numero) {
        this.loadSimilarPlayers()
      } else {
        this.error = "Paramètres manquants pour trouver des joueurs similaires"
        this.isLoading = false
      }
    })
  }

  loadSimilarPlayers(): void {
    this.isLoading = true
    this.rapportService.getSimilarRapports(this.poste, this.numero).subscribe(
      (reports) => {
        this.similarReports = reports
        this.isLoading = false
      },
      (error) => {
        console.error("Erreur lors du chargement des joueurs similaires:", error)
        this.error = "Impossible de charger les joueurs similaires"
        this.isLoading = false
      },
    )
  }

  goBack(): void {
    this.router.navigate(["/rapports"])
  }

  getStatusClass(status: string): string {
    if (!status) return ""

    status = status.toLowerCase()
    if (status.includes("excellent") || status.includes("bon")) {
      return "status-good"
    } else if (status.includes("moyen")) {
      return "status-average"
    } else if (status.includes("mauvais") || status.includes("faible")) {
      return "status-bad"
    }
    return ""
  }

  getInjuryClass(injury: string): string {
    if (!injury) return ""

    injury = injury.toLowerCase()
    if (injury.includes("aucune") || injury.includes("non")) {
      return "status-good"
    } else if (injury.includes("légère") || injury.includes("mineure")) {
      return "status-average"
    } else if (injury.includes("grave") || injury.includes("sérieuse")) {
      return "status-bad"
    }
    return ""
  }
}
