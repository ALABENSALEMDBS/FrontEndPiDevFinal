import { CommonModule } from "@angular/common"
import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { Subscription } from "rxjs"
import { CupService } from "src/app/services/serviceCup/cup.service"
import { ClubsService } from "src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service"
import { Clubs } from "src/core/models/clubs"
import { Cup } from "src/core/models/cup"

@Component({
  selector: "app-cup-clubs",
  standalone: true,
  templateUrl: "./cup-clubs.component.html",
  styleUrls: ["./cup-clubs.component.css"],
  imports: [CommonModule],
})
export class CupClubsComponent implements OnInit, OnDestroy {
  cupId!: number
  cup: Cup | null = null
  clubs: Clubs[] = []
  loading = true
  error = ""

  // Map to store club logo URLs by club ID
  clubLogoUrls: Map<number, string> = new Map()

  // Track loading status for each club logo
  logoLoadingStatus: Map<number, boolean> = new Map()

  // Subscriptions to clean up
  private subscriptions: Subscription[] = []

  constructor(
    private cupService: CupService,
    private route: ActivatedRoute,
    private router: Router,
    private clubService: ClubsService,
  ) {}

  ngOnInit(): void {
    this.cupId = +this.route.snapshot.paramMap.get("id")!
    this.loadCup()
    this.loadClubs()
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

  loadCup(): void {
    const sub = this.cupService.getCupById(this.cupId).subscribe({
      next: (data) => {
        this.cup = data
      },
      error: (err) => {
        this.error = "Failed to load cup details."
        console.error(err)
      },
    })
    this.subscriptions.push(sub)
  }

  loadClubs(): void {
    this.loading = true
    const sub = this.cupService.getParticipatingClubs(this.cupId).subscribe({
      next: (data) => {
        this.clubs = data

        // Load logos for each club
        this.clubs.forEach((club) => {
          this.loadClubLogo(club)
        })

        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load participating clubs. Please try again."
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
      // First approach: Use direct URL construction
      const cleanFilename = club.mediaUrl.replace(/^\.\/uploadss\\/i, "")
      const directUrl = `http://localhost:8089/PiDevBackEndProject/club/uploads/${cleanFilename}?t=${new Date().getTime()}`

      // Store the URL for this club
      this.clubLogoUrls.set(club.idClub, directUrl)
      this.logoLoadingStatus.set(club.idClub, false)
    } else {
      // Use default logo
      this.clubLogoUrls.set(club.idClub, "assets/images/default-club-logo.png")
      this.logoLoadingStatus.set(club.idClub, false)
    }
  }

  goBack(): void {
    this.router.navigate(["/superadmin/showcup"])
  }

  formatDate(dateString: string): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  getClubLogoUrl(club: Clubs): string {
    if (!club || !club.idClub) {
      return "assets/images/default-club-logo.png"
    }

    // Return the stored URL for this specific club
    return this.clubLogoUrls.get(club.idClub) || "assets/images/default-club-logo.png"
  }

  isLogoLoading(club: Clubs): boolean {
    if (!club || !club.idClub) return false
    return this.logoLoadingStatus.get(club.idClub) || false
  }
}
