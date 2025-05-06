// import { CommonModule } from "@angular/common"
// import { Component, OnInit } from "@angular/core"
// import { ActivatedRoute, Router } from "@angular/router"
// import { CompetitionService } from "src/app/services/serviceCompetition/competition.service"
// import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service"
// import { Competition } from "src/core/models/competition"
// import { Match } from "src/core/models/match"


// @Component({
//   selector: "app-competition-matches",
//   standalone: true,
//   templateUrl: "./competition-matches.component.html",
//   styleUrls: ["./competition-matches.component.css"],
//   imports: [CommonModule],
// })
// export class CompetitionMatchesComponent implements OnInit {
//   competitionId!: number
//   competition: Competition | null = null
//   matches: Match[] = []
//   loading = true
//   error = ""

//   constructor(
//     private competitionService: CompetitionService,
//     private matchService: MatchService,
//     private route: ActivatedRoute,
//     private router: Router,
//   ) {}

//   ngOnInit(): void {
//     this.competitionId = +this.route.snapshot.paramMap.get("id")!
//     this.loadCompetition()
//     this.loadMatches()
//   }

//   loadCompetition(): void {
//     this.competitionService.getCompetitionById(this.competitionId).subscribe({
//       next: (data) => {
//         this.competition = data
//       },
//       error: (err) => {
//        // this.error = "Failed to load competition details."
//         console.error(err)
//       },
//     })
//   }

//   loadMatches(): void {
//     this.loading = true
//     this.competitionService.getMatchesOfCompetition(this.competitionId).subscribe({
//       next: (data) => {
//         this.matches = data
//         this.loading = false
//       },
//       error: (err) => {
//         this.error = "Failed to load matches. Please try again."
//         console.error(err)
//         this.loading = false
//       },
//     })
//   }

//   editMatch(id: number): void {
//     this.router.navigate(["/superadmin/showmatch/update", id])
//   }

//   updateGoals(id: number): void {
//     this.router.navigate(["/superadmin/showmatch/update-goals", id])
//   }

//   goBack(): void {
//     this.router.navigate(["/superadmin/showcompetition"])
//   }

//   formatDate(dateString: string): string {
//     if (!dateString) return ""
//     const date = new Date(dateString)
//     return date.toLocaleString()
//   }

//   getStatusClass(status: string): string {
//     switch (status?.toLowerCase()) {
//       case "scheduled":
//         return "badge bg-info"
//       case "in progress":
//         return "badge bg-warning"
//       case "completed":
//         return "badge bg-success"
//       case "postponed":
//         return "badge bg-secondary"
//       case "cancelled":
//         return "badge bg-danger"
//       default:
//         return "badge bg-light text-dark"
//     }
//   }
// }
import { CommonModule } from "@angular/common"
import { Component, OnInit, OnDestroy } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Subscription } from "rxjs"
import { CompetitionService } from "src/app/services/serviceCompetition/competition.service"
import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service"
import { Competition } from "src/core/models/competition"
import { Match } from "src/core/models/match"
import { Clubs } from "src/core/models/clubs"

@Component({
  selector: "app-competition-matches",
  standalone: true,
  templateUrl: "./competition-matches.component.html",
  styleUrls: ["./competition-matches.component.css"],
  imports: [CommonModule],
})
export class CompetitionMatchesComponent implements OnInit, OnDestroy {
  competitionId!: number
  competition: Competition | null = null
  matches: Match[] = []
  loading = true
  error = ""

  // Base URL for club logos
  private baseLogoUrl = "http://localhost:8089/PiDevBackEndProject/club/uploads/"

  // Default logo path
  private defaultLogoPath = "assets/images/default-club-logo.png"

  // Map to store club logo URLs by club ID
  clubLogoUrls: Map<number, string> = new Map()

  // Track loading status for each club logo
  logoLoadingStatus: Map<number, boolean> = new Map()

  // Subscriptions to clean up
  private subscriptions: Subscription[] = []

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

  ngOnDestroy(): void {
    // Clean up all subscriptions
    this.subscriptions.forEach((sub) => sub.unsubscribe())

    // Revoke any object URLs to prevent memory leaks
    this.clubLogoUrls.forEach((url) => {
      if (url.startsWith("blob:")) {
        URL.revokeObjectURL(url)
      }
    })
  }

  loadCompetition(): void {
    const sub = this.competitionService.getCompetitionById(this.competitionId).subscribe({
      next: (data) => {
        this.competition = data
      },
      error: (err) => {
        this.error = "The Matchs' details aren't all completed."
        console.error(err)
      },
    })
    this.subscriptions.push(sub)
  }

  loadMatches(): void {
    this.loading = true
    const sub = this.competitionService.getMatchesOfCompetition(this.competitionId).subscribe({
      next: (data) => {
        this.matches = data

        // Preload all club logos
        this.matches.forEach((match) => {
          if (match.club1) this.loadClubLogo(match.club1)
          if (match.club2) this.loadClubLogo(match.club2)
        })

        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load matches. Please try again."
        console.error(err)
        this.loading = false
      },
    })
    this.subscriptions.push(sub)
  }

  loadClubLogo(club: Clubs): void {
    if (!club.idClub) {
      console.error("Club is missing ID:", club)
      return
    }

    // Mark this club's logo as loading
    this.logoLoadingStatus.set(club.idClub, true)

    if (club.mediaUrl) {
      try {
        // Extract filename from path (e.g., "./uploadss\1746393725576.jpg" -> "1746393725576.jpg")
        const cleanFilename = club.mediaUrl.replace(/^\.\/uploadss\\/i, "")

        // Add timestamp to prevent caching
        const timestamp = new Date().getTime()

        // Create the full URL with cache busting
        const logoUrl = `${this.baseLogoUrl}${cleanFilename}?t=${timestamp}`

        // Store the URL for this club
        this.clubLogoUrls.set(club.idClub, logoUrl)
      } catch (error) {
        console.error("Error generating logo URL for club:", club.nameClub, error)
        this.clubLogoUrls.set(club.idClub, this.defaultLogoPath)
      }
    } else {
      // Use default logo
      this.clubLogoUrls.set(club.idClub, this.defaultLogoPath)
    }

    // Mark logo as loaded
    this.logoLoadingStatus.set(club.idClub, false)
  }

  getClubLogoUrl(club: Clubs | undefined): string {
    if (!club || !club.idClub) {
      return this.defaultLogoPath
    }

    // Return the stored URL for this specific club
    return this.clubLogoUrls.get(club.idClub) || this.defaultLogoPath
  }

  isLogoLoading(club: Clubs | undefined): boolean {
    if (!club || !club.idClub) return false
    return this.logoLoadingStatus.get(club.idClub) || false
  }

  editMatch(id: number): void {
    // Updated to use the competition-specific update route
    this.router.navigate(["/superadmin/showcompetition/update-match", this.competitionId, id])
  }

  updateGoals(id: number): void {
    // Navigate to the competition-specific goals update
    this.router.navigate(["/superadmin/showcompetition/update-goals", this.competitionId, id])
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
