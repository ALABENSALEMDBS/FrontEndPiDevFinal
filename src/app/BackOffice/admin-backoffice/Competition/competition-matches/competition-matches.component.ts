import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { CompetitionService } from "src/app/services/serviceCompetition/competition.service"
import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service"
import { Competition } from "src/core/models/competition"
import { Match } from "src/core/models/match"


@Component({
  selector: "app-competition-matches",
  standalone: true,
  templateUrl: "./competition-matches.component.html",
  styleUrls: ["./competition-matches.component.css"],
  imports: [CommonModule],
})
export class CompetitionMatchesComponent implements OnInit {
  competitionId!: number
  competition: Competition | null = null
  matches: Match[] = []
  loading = true
  error = ""

  constructor(
    private competitionService: CompetitionService,
    private matchService: MatchService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.competitionId = +this.route.snapshot.paramMap.get("id")!
    this.loadCompetition()
    this.loadMatches()
  }

  loadCompetition(): void {
    this.competitionService.getCompetitionById(this.competitionId).subscribe({
      next: (data) => {
        this.competition = data
      },
      error: (err) => {
        this.error = "Failed to load competition details."
        console.error(err)
      },
    })
  }

  loadMatches(): void {
    this.loading = true
    this.competitionService.getMatchesOfCompetition(this.competitionId).subscribe({
      next: (data) => {
        this.matches = data
        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load matches. Please try again."
        console.error(err)
        this.loading = false
      },
    })
  }

  editMatch(id: number): void {
    this.router.navigate(["/superadmin/showmatch/update", id])
  }

  updateGoals(id: number): void {
    this.router.navigate(["/superadmin/showmatch/update-goals", id])
  }

  goBack(): void {
    this.router.navigate(["/superadmin/showcompetition"])
  }

  formatDate(dateString: string): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "badge bg-info"
      case "in progress":
        return "badge bg-warning"
      case "completed":
        return "badge bg-success"
      case "postponed":
        return "badge bg-secondary"
      case "cancelled":
        return "badge bg-danger"
      default:
        return "badge bg-light text-dark"
    }
  }
}
