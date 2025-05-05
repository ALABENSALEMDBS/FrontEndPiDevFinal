import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { CompetitionService } from "src/app/services/serviceCompetition/competition.service"
import { Competition } from "src/core/models/competition"
import { Match } from "src/core/models/match"


@Component({
  selector: "app-competition-matches-display",
  standalone: true,
  templateUrl: "./competition-matches-display.component.html",
  styleUrls: ["./competition-matches-display.component.css"],
  imports: [CommonModule, RouterModule],
})
export class CompetitionMatchesDisplayComponent implements OnInit {
  competitionId!: number
  competition: Competition | null = null
  matches: Match[] = []
  upcomingMatches: Match[] = []
  recentMatches: Match[] = []
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
    this.loadMatches()
  }

  loadCompetition(): void {
    this.competitionService.getCompetitionById(this.competitionId).subscribe({
      next: (data) => {
        this.competition = data
        this.currentPage = `${data.nameCompetition} - Matches`
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

        // Separate matches into upcoming and recent
        const now = new Date()
        this.upcomingMatches = this.matches
          .filter((match) => new Date(match.dateMatch) > now || match.statusMatch?.toLowerCase() === "scheduled")
          .sort((a, b) => new Date(a.dateMatch).getTime() - new Date(b.dateMatch).getTime())

        this.recentMatches = this.matches
          .filter((match) => match.goals1 !== null && match.goals2 !== null)
          .sort((a, b) => new Date(b.dateMatch).getTime() - new Date(a.dateMatch).getTime())

        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load matches. Please try again."
        console.error(err)
        this.loading = false
      },
    })
  }

  formatDate(dateString: string): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  formatTime(dateString: string): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  getWinnerStatus(match: Match, clubId: number): string {
    if (!match.goals1 || !match.goals2) return ""

    if (match.club1.idClub === clubId) {
      if (match.goals1 > match.goals2) return "(win)"
      if (match.goals1 < match.goals2) return "(loss)"
      return "(draw)"
    } else {
      if (match.goals2 > match.goals1) return "(win)"
      if (match.goals2 < match.goals1) return "(loss)"
      return "(draw)"
    }
  }
}
