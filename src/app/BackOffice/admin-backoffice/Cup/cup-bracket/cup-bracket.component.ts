// src/app/components/cup/cup-bracket/cup-bracket.component.ts
import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { CupService } from "src/app/services/serviceCup/cup.service"
import { Cup } from "src/core/models/cup"
import { Match } from "src/core/models/match"

interface BracketRound {
  name: string
  matches: Match[]
}

@Component({
  selector: "app-cup-bracket",
  standalone: true,
  templateUrl: "./cup-bracket.component.html",
  styleUrls: ["./cup-bracket.component.css"],
  imports: [CommonModule],
})
export class CupBracketComponent implements OnInit {
  cupId!: number
  cup: Cup | null = null
  bracketRounds: BracketRound[] = []
  loading = true
  error = ""

  constructor(
    private cupService: CupService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cupId = +this.route.snapshot.paramMap.get("id")!
    this.loadCup()
    this.loadBracket()
  }

  loadCup(): void {
    this.cupService.getCupById(this.cupId).subscribe({
      next: (data) => {
        this.cup = data
      },
      error: (err) => {
        this.error = "Failed to load cup details."
        console.error(err)
      },
    })
  }

  loadBracket(): void {
    this.loading = true
    this.cupService.getMatchesByRound(this.cupId).subscribe({
      next: (data) => {
        // Convert the object to an array of rounds
        this.bracketRounds = Object.entries(data).map(([roundName, matches]) => ({
          name: roundName,
          matches: matches,
        }))

        // Sort rounds in proper order (Final first, then Semi-Final, etc.)
        this.bracketRounds.sort((a, b) => {
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

          return getOrderValue(a.name) - getOrderValue(b.name)
        })

        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load bracket data. Please try again."
        console.error(err)
        this.loading = false
      },
    })
  }

  getMatchResult(match: Match): string {
    if (match.goals1 !== null && match.goals2 !== null) {
      return `${match.goals1} - ${match.goals2}`
    }
    return "vs"
  }

  getMatchWinner(match: Match): string {
    if (!match.winner) return ""
    return match.winner.nameClub
  }

  hasWinner(match: Match): boolean {
    return !!match.winner
  }

  getMatchClass(match: Match): string {
    if (!match.statusMatch) return "match-pending"

    switch (match.statusMatch.toLowerCase()) {
      case "completed":
        return "match-completed"
      case "in progress":
        return "match-in-progress"
      case "cancelled":
        return "match-cancelled"
      case "postponed":
        return "match-postponed"
      default:
        return "match-pending"
    }
  }

  goBack(): void {
    this.router.navigate(["/superadmin/showcup"])
  }

  viewMatches(): void {
    this.router.navigate(["/superadmin/showcup/matches", this.cupId])
  }
}
