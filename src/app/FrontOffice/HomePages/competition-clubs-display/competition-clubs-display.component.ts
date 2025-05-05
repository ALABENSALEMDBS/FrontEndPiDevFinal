import { CommonModule } from "@angular/common"
import { Component, OnInit, OnDestroy } from "@angular/core"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { CompetitionService } from "src/app/services/serviceCompetition/competition.service"
import { ClubsService } from "src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service"
import { Clubs } from "src/core/models/clubs"
import { Competition } from "src/core/models/competition"
import { Subscription } from "rxjs"

@Component({
  selector: "app-competition-clubs-display",
  standalone: true,
  templateUrl: "./competition-clubs-display.component.html",
  styleUrls: ["./competition-clubs-display.component.css"],
  imports: [CommonModule, RouterModule],
})
export class CompetitionClubsDisplayComponent implements OnInit, OnDestroy {
  competitionId!: number
  competition: Competition | null = null
  clubs: Clubs[] = []
  loading = true
  error = ""
  currentPage = ""
  
  // Base URL for club logos
  private baseLogoUrl = "http://localhost:8089/PiDevBackEndProject/club/uploads/";
  
  // Default logo path
  private defaultLogoPath = "assets/images/default-club-logo.png";
  
  // Subscriptions to clean up
  private subscriptions: Subscription[] = [];
  
  // Track blob URLs to revoke on destroy
  private blobUrls: string[] = [];

  constructor(
    private competitionService: CompetitionService,
    private route: ActivatedRoute,
    private router: Router,
    private clubService: ClubsService,
  ) {}

  ngOnInit(): void {
    this.competitionId = +this.route.snapshot.paramMap.get("id")!
    this.loadCompetition()
    this.loadClubs()
  }
  
  ngOnDestroy(): void {
    // Clean up all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Revoke any blob URLs to prevent memory leaks
    this.blobUrls.forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
  }

  loadCompetition(): void {
    const sub = this.competitionService.getCompetitionById(this.competitionId).subscribe({
      next: (data) => {
        this.competition = data
        this.currentPage = `${data.nameCompetition} - Clubs`
      },
      error: (err) => {
        this.error = "Failed to load competition details."
        console.error(err)
      },
    });
    this.subscriptions.push(sub);
  }

  loadClubs(): void {
    this.loading = true
    const sub = this.competitionService.getParticipatingClubs(this.competitionId).subscribe({
      next: (data) => {
        this.clubs = data;
        
        // Process each club to ensure logo URLs are correct
        this.clubs.forEach(club => {
          this.setClubLogoUrl(club);
        });
        
        this.loading = false;
      },
      error: (err) => {
        this.error = "Failed to load participating clubs. Please try again."
        console.error(err)
        this.loading = false
      },
    });
    this.subscriptions.push(sub);
  }
  
  // Helper method to set the correct logo URL for a club
  setClubLogoUrl(club: Clubs): void {
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
  getClubLogoUrl(club: Clubs | undefined): string {
    if (!club) return this.defaultLogoPath;
    return club.logo || this.defaultLogoPath;
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
}