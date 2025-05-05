import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { RouterModule } from "@angular/router"
import { CompetitionService } from "src/app/services/serviceCompetition/competition.service"
import { Competition } from "src/core/models/competition"
import { NavbarHomeComponent } from "../navbar-home/navbar-home.component";


@Component({
  selector: "app-competition-display",
  standalone: true,
  templateUrl: "./competition-display.component.html",
  styleUrls: ["./competition-display.component.css"],
  imports: [CommonModule, RouterModule, NavbarHomeComponent],
})
export class CompetitionDisplayComponent implements OnInit {
  competitions: Competition[] = []
  featuredCompetition: Competition | null = null
  loading = true
  error = ""
  currentPage = "Competitions"

  constructor(private competitionService: CompetitionService) {}

  ngOnInit(): void {
    this.loadCompetitions()
  }

  loadCompetitions(): void {
    this.loading = true
    this.competitionService.getAllCompetitions().subscribe({
      next: (data) => {
        this.competitions = data

        // Set the first competition as the featured one if available
        if (this.competitions.length > 0) {
          this.featuredCompetition = this.competitions[0]
        }

        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load competitions. Please try again."
        console.error(err)
        this.loading = false
      },
    })
  }

  getTypeClass(type: string): string {
    switch (type?.toUpperCase()) {
      case "LIGUE":
        return "badge bg-primary"
      case "COUPE":
        return "badge bg-success"
      case "AMICAL":
        return "badge bg-info"
      default:
        return "badge bg-secondary"
    }
  }

  getMatchCount(competition: Competition): number {
    return competition.matchesTournoi?.length || 0
  }
}
