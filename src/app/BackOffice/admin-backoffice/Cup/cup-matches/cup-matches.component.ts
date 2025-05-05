import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CupService } from "src/app/services/serviceCup/cup.service";
import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service";
import { Cup } from "src/core/models/cup";
import { Match } from "src/core/models/match";
import { Clubs } from "src/core/models/clubs";

@Component({
  selector: "app-cup-matches",
  standalone: true,
  templateUrl: "./cup-matches.component.html",
  styleUrls: ["./cup-matches.component.css"],
  imports: [CommonModule],
})
export class CupMatchesComponent implements OnInit {
  cupId!: number;
  cup: Cup | null = null;
  matchesByRound: Record<string, Match[]> = {};
  roundNames: string[] = [];
  loading = true;
  error = "";
  successMessage = "";
  
  // Base URL for club logos
  private baseLogoUrl = "http://localhost:8089/PiDevBackEndProject/club/uploads/";
  
  // Default logo path
  private defaultLogoPath = "assets/images/default-club-logo.png";

  constructor(
    private cupService: CupService,
    private matchService: MatchService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.cupId = +this.route.snapshot.paramMap.get("id")!;
    this.loadCup();
    this.loadMatches();
  }

  loadCup(): void {
    this.cupService.getCupById(this.cupId).subscribe({
      next: (data) => {
        this.cup = data;
      },
      error: (err) => {
        this.error = "Failed to load cup details.";
        console.error(err);
      },
    });
  }

  loadMatches(): void {
    this.loading = true;
    this.cupService.getMatchesByRound(this.cupId).subscribe({
      next: (data) => {
        this.matchesByRound = data;
        this.roundNames = Object.keys(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = "Failed to load matches. Please try again.";
        console.error(err);
        this.loading = false;
      },
    });
  }

  generateNextRound(): void {
    if (confirm('Are you sure you want to generate the next round?')) {
      this.cupService.generateNextRound(this.cupId).subscribe({
        next: (response) => {
          this.successMessage = "Next round generated successfully!";
          setTimeout(() => {
            this.successMessage = "";
            this.loadMatches(); // Reload matches to reflect changes
          }, 1500);
        },
        error: (err) => {
          this.error = err.error || "Failed to generate next round. Please try again.";
          console.error(err);
        },
      });
    }
  }

  editMatch(id: number): void {
    this.router.navigate(["/superadmin/showcup/update-match", this.cupId, id]);
  }

  updateGoals(id: number): void {
    this.router.navigate(["/superadmin/showcup/update-goals", this.cupId, id]);
  }

  goBack(): void {
    this.router.navigate(["/superadmin/showcup"]);
  }

  formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case "scheduled":
        return "badge bg-info";
      case "in progress":
        return "badge bg-warning";
      case "completed":
        return "badge bg-success";
      case "postponed":
        return "badge bg-secondary";
      case "cancelled":
        return "badge bg-danger";
      default:
        return "badge bg-light text-dark";
    }
  }

  getWinnerName(match: Match): string {
    if (!match.winner) return "Not determined";
    return match.winner.nameClub;
  }

  hasWinner(match: Match): boolean {
    return !!match.winner;
  }

  allMatchesHaveWinners(matches: Match[]): boolean {
    return matches.every(match => !!match.winner);
  }

  isLastRound(): boolean {
    return this.roundNames.length > 0 && this.roundNames[0] === "Final" && 
           this.matchesByRound["Final"].length === 1;
  }

  getTournamentWinner(): string {
    if (this.isLastRound() && this.matchesByRound["Final"][0].winner) {
      return this.matchesByRound["Final"][0].winner.nameClub;
    }
    return "";
  }
  
  // Method to get the correct club logo URL
  getClubLogoUrl(club: Clubs | undefined): string {
    if (!club || !club.mediaUrl) {
      return this.defaultLogoPath;
    }
    
    try {
      // Extract filename from path (e.g., "./uploadss\1746393725576.jpg" -> "1746393725576.jpg")
      const cleanFilename = club.mediaUrl.replace(/^\.\/uploadss\\/i, '');
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      
      // Return the full URL with cache busting
      return `${this.baseLogoUrl}${cleanFilename}?t=${timestamp}`;
    } catch (error) {
      console.error('Error generating logo URL for club:', club.nameClub, error);
      return this.defaultLogoPath;
    }
  }
}