import { CommonModule } from "@angular/common"
import { Component, OnInit, OnDestroy } from "@angular/core"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { CompetitionService } from "src/app/services/serviceCompetition/competition.service"
import { ClubsService } from "src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service"
import { Competition } from "src/core/models/competition"
import { Standing } from "src/core/models/Standing"
import { Subscription } from "rxjs"

@Component({
  selector: "app-competition-standings-display",
  standalone: true,
  templateUrl: "./competition-standings-display.component.html",
  styleUrls: ["./competition-standings-display.component.css"],
  imports: [CommonModule, RouterModule],
})
export class CompetitionStandingsDisplayComponent implements OnInit, OnDestroy {
  competitionId!: number
  competition: Competition | null = null
  standings: Standing[] = []
  loading = true
  error = ""
  currentPage = ""
  
  // Base URL for club logos
  private baseLogoUrl = "http://localhost:8089/PiDevBackEndProject/club/uploads/";
  
  // Default logo path
  private defaultLogoPath = "assets/images/default-club-logo.png";
  
  // Subscriptions to clean up
  private subscriptions: Subscription[] = [];

  constructor(
    private competitionService: CompetitionService,
    private route: ActivatedRoute,
    private router: Router,
    private clubsService: ClubsService
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
  
  ngOnDestroy(): void {
    // Clean up all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadCompetition(): void {
    const sub = this.competitionService.getCompetitionById(this.competitionId).subscribe({
      next: (data) => {
        this.competition = data
        this.currentPage = `${data.nameCompetition} - Standings`
      },
      error: (err) => {
        this.error = "Failed to load competition details."
        console.error(err)
      },
    });
    this.subscriptions.push(sub);
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
        
        // Process each standing to ensure club logo URLs are correct
        this.standings.forEach(standing => {
          if (standing.club) {
            this.setClubLogoUrl(standing.club);
          }
        });

        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load standings. Please try again."
        console.error(err)
        this.loading = false
      },
    });
    this.subscriptions.push(sub);
  }
  
  // Helper method to set the correct logo URL for a club
  setClubLogoUrl(club: any): void {
    if (!club) return;
    
    try {
      if (club.mediaUrl) {
        // Extract filename from path (e.g., "./uploadss\1746393725576.jpg" -> "1746393725576.jpg")
        const cleanFilename = club.mediaUrl.replace(/^\.\/uploadss\\/i, '');
        
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        
        // Set the logo property with the full URL
        club.logo = `${this.baseLogoUrl}${cleanFilename}?t=${timestamp}&clubId=${club.idClub}`;
      } else {
        club.logo = this.defaultLogoPath;
      }
    } catch (error) {
      console.error('Error setting logo URL for club:', club.nameClub, error);
      club.logo = this.defaultLogoPath;
    }
  }
  
  // Method to get the correct club logo URL (for use in template)
  getClubLogoUrl(club: any): string {
    if (!club) return this.defaultLogoPath;
    return club.logo || this.defaultLogoPath;
  }
}