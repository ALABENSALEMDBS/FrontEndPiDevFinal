import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { CupService } from "src/app/services/serviceCup/cup.service"
import { Cup } from "src/core/models/cup"
import { Match } from "src/core/models/match"

@Component({
  selector: "app-cup-matches-display",
  standalone: true,
  templateUrl: "./cup-matches-display.component.html",
  styleUrls: ["./cup-matches-display.component.css"],
  imports: [CommonModule, RouterModule],
})
export class CupMatchesDisplayComponent implements OnInit {
  cupId!: number
  cup: Cup | null = null
  matchesByRound: Record<string, Match[]> = {}
  roundNames: string[] = []
  loading = true
  error = ""
  currentPage = ""

  // Base URL for club logos and default logo path
  private baseLogoUrl = "http://localhost:8089/PiDevBackEndProject/club/uploads/"
  private defaultLogoPath = "assets/images/default-club-logo.png"

  constructor(
    private cupService: CupService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cupId = +this.route.snapshot.paramMap.get("id")!
    this.loadCup()
    this.loadMatches()
  }

  loadCup(): void {
    this.cupService.getCupById(this.cupId).subscribe({
      next: (data) => {
        this.cup = data
        this.currentPage = `${data.name} - Matches`
      },
      error: (err) => {
        this.error = "Failed to load cup details."
        console.error(err)
      },
    })
  }

  loadMatches(): void {
    this.loading = true
    this.cupService.getMatchesByRound(this.cupId).subscribe({
      next: (data) => {
        this.matchesByRound = data
        this.roundNames = Object.keys(data)

        // Sort rounds in proper order (Final first, then Semi-Final, etc.)
        this.roundNames.sort((a, b) => {
          const roundOrder: Record<string, number> = {
            Final: 1,
            "Semi-Final": 2,
            "Quarter-Final": 3,
            "Round of 16": 4,
            "Round of 32": 5,
            "Round of 64": 6,
          }

          // Extract the round name if it contains one of the keys
          const getOrderValue = (roundName: string): number => {
            for (const key of Object.keys(roundOrder)) {
              if (roundName.includes(key)) {
                return roundOrder[key]
              }
            }
            return 999 // Default high value for unknown rounds
          }

          return getOrderValue(a) - getOrderValue(b)
        })

        // Set logo URLs for all clubs in all matches
        for (const roundName of this.roundNames) {
          for (const match of this.matchesByRound[roundName]) {
            if (match.club1) this.setClubLogoUrl(match.club1)
            if (match.club2) this.setClubLogoUrl(match.club2)
            if (match.winner) this.setClubLogoUrl(match.winner)
          }
        }

        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load matches. Please try again."
        console.error(err)
        this.loading = false
      },
    })
  }

  // Helper methods for handling club logos
  setClubLogoUrl(club: any): void {
    if (!club) return

    try {
      if (club.mediaUrl) {
        const cleanFilename = club.mediaUrl.replace(/^(\.\/)?uploadss[\\/]/i, "").trim()
        const timestamp = new Date().getTime()
        club.logo = `${this.baseLogoUrl}${cleanFilename}?t=${timestamp}&clubId=${club.idClub}`
      } else {
        club.logo = this.defaultLogoPath
      }
    } catch (error) {
      console.error("Error setting logo URL for club:", club.nameClub, error)
      club.logo = this.defaultLogoPath
    }
  }

  getClubLogoUrl(club: any): string {
    if (!club) return this.defaultLogoPath
    return club.logo || this.defaultLogoPath
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

  getWinnerName(match: Match): string {
    if (!match.winner) return "Not determined"
    return match.winner.nameClub
  }

  hasWinner(match: Match): boolean {
    return !!match.winner
  }

  allMatchesHaveWinners(matches: Match[]): boolean {
    return matches.every((match) => !!match.winner)
  }

  isLastRound(): boolean {
    return this.roundNames.length > 0 && this.roundNames[0] === "Final" && this.matchesByRound["Final"].length === 1
  }

  getTournamentWinner(): string {
    if (this.isLastRound() && this.matchesByRound["Final"][0].winner) {
      return this.matchesByRound["Final"][0].winner.nameClub
    }
    return ""
  }
}