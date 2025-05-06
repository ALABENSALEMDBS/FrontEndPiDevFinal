import { CommonModule } from "@angular/common"
import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { RouterModule } from "@angular/router"
import { CompetitionService } from "src/app/services/serviceCompetition/competition.service"
import { Subscription } from "rxjs"
import { ReactiveFormsModule } from "@angular/forms"
import { Competition } from "src/core/models/competition"
import { Standing } from "src/core/models/Standing"
import { Clubs } from "src/core/models/clubs"

@Component({
  selector: "app-competition-standings",
  standalone: true,
  templateUrl: "./competition-standings-component.component.html",
  styleUrls: ["./competition-standings-component.component.css"],
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
})
export class CompetitionStandingsComponent implements OnInit, OnDestroy {
  competitionId!: number
  competition!: Competition
  standings: Standing[] = []
  loading = true
  error = ""
  successMessage = ""

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
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.competitionId = +this.route.snapshot.paramMap.get("id")!
    this.loadCompetition()
    this.loadStandings()
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
        this.error = "Failed to load competition details."
        console.error(err)
      },
    })
    this.subscriptions.push(sub)
  }

  loadStandings(): void {
    this.loading = true
    const sub = this.competitionService.getStandings(this.competitionId).subscribe({
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

        // Load logos for all clubs in standings
        this.standings.forEach((standing) => {
          if (standing.club) {
            this.loadClubLogo(standing.club)
          }
        })

        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load standings. Please try again."
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

  getClubLogoUrl(club: Clubs): string {
    if (!club || !club.idClub) {
      return this.defaultLogoPath
    }

    // Return the stored URL for this specific club
    return this.clubLogoUrls.get(club.idClub) || this.defaultLogoPath
  }

  isLogoLoading(club: Clubs): boolean {
    if (!club || !club.idClub) return false
    return this.logoLoadingStatus.get(club.idClub) || false
  }

  updateStandings(): void {
    this.loading = true
    this.error = ""
    this.successMessage = ""

    const sub = this.competitionService.generateStandings(this.competitionId).subscribe({
      next: () => {
        this.successMessage = "Standings updated successfully!"
        this.loadStandings() // Reload standings after update
      },
      error: (err) => {
        this.error = "Failed to update standings. Please try again."
        console.error(err)
        this.loading = false
      },
    })
    this.subscriptions.push(sub)
  }

  goBack(): void {
    this.router.navigate(["../../"], { relativeTo: this.route })
  }
}
