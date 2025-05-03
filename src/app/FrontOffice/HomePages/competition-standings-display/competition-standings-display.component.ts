import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { CompetitionService } from "src/app/services/serviceCompetition/competition.service"
import { Competition } from "src/core/models/competition"
import { Standing } from "src/core/models/Standing"


@Component({
  selector: "app-competition-standings-display",
  standalone: true,
  templateUrl: "./competition-standings-display.component.html",
  styleUrls: ["./competition-standings-display.component.css"],
  imports: [CommonModule, RouterModule],
})
export class CompetitionStandingsDisplayComponent implements OnInit {
  competitionId!: number
  competition: Competition | null = null
  standings: Standing[] = []
  loading = true
  error = ""
  currentPage = ""

  constructor(
    private competitionService: CompetitionService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.competitionId = +this.route.snapshot.paramMap.get("id")!
    this.loadCompetition()
    this.loadStandings()

    // Add this to ensure styles are applied correctly
    document.documentElement.style.setProperty("--first-place-color", "#ffd70033")
    document.documentElement.style.setProperty("--second-place-color", "#c0c0c033")
    document.documentElement.style.setProperty("--third-place-color", "#cd7f3233")
  }

  loadCompetition(): void {
    this.competitionService.getCompetitionById(this.competitionId).subscribe({
      next: (data) => {
        this.competition = data
        this.currentPage = `${data.nameCompetition} - Standings`
      },
      error: (err) => {
        this.error = "Failed to load competition details."
        console.error(err)
      },
    })
  }

  loadStandings(): void {
    this.loading = true
    this.competitionService.getStandings(this.competitionId).subscribe({
      next: (data) => {
        // Filter standings for this competition only
        this.standings = data.filter((standing) => standing.competition?.idCompetition === this.competitionId)

        // Sort standings by points (descending), then goal difference
        this.standings.sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points
          }
          return b.goalDifference - a.goalDifference
        })

        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load standings. Please try again."
        console.error(err)
        this.loading = false
      },
    })
  }
}
