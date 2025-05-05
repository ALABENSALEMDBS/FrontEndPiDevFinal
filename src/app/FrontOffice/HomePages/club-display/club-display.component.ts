import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service";
import { ClubsService } from "src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service";
import { Clubs } from "src/core/models/clubs";
import { Match } from "src/core/models/match";
import { NavbarHomeComponent } from "../navbar-home/navbar-home.component";
import { Subscription } from "rxjs";

@Component({
  selector: "app-club-display",
  standalone: true,
  templateUrl: "./club-display.component.html",
  styleUrls: ["./club-display.component.css"],
  imports: [CommonModule, RouterModule, NavbarHomeComponent],
})
export class ClubDisplayComponent implements OnInit, OnDestroy {
  clubs: Clubs[] = [];
  recentMatches: Match[] = [];
  upcomingMatches: Match[] = [];
  featuredMatch: Match | null = null;
  loading = true;
  error = "";
  currentPage = "Clubs & Matches";
  
  // Base URL for club logos
  private baseLogoUrl = "http://localhost:8089/PiDevBackEndProject/club/uploads/";
  
  // Default logo path
  private defaultLogoPath = "assets/images/default-club-logo.png";
  
  // Subscriptions to clean up
  private subscriptions: Subscription[] = [];

  constructor(
    private clubsService: ClubsService,
    private matchService: MatchService
  ) {}

  ngOnInit(): void {
    this.loadClubs();
    this.loadMatches();
  }
  
  ngOnDestroy(): void {
    // Clean up all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadClubs(): void {
    const sub = this.clubsService.getAllClubs().subscribe({
      next: (data) => {
        this.clubs = data;
        
        // Process each club to ensure logo URLs are correct
        this.clubs.forEach(club => {
          // Add a logo property with the correct URL
          this.setClubLogoUrl(club);
        });
      },
      error: (err) => {
        this.error = "Failed to load clubs. Please try again.";
        console.error(err);
      },
    });
    this.subscriptions.push(sub);
  }

  loadMatches(): void {
    this.loading = true;
    
    // Load played matches for recent matches
    const sub1 = this.matchService.getPlayedMatches().subscribe({
      next: (data) => {
        this.recentMatches = data.slice(0, 5); // Get the 5 most recent matches
        
        // Process each match to ensure club logo URLs are correct
        this.recentMatches.forEach(match => {
          if (match.club1) this.setClubLogoUrl(match.club1);
          if (match.club2) this.setClubLogoUrl(match.club2);
        });
        
        // Set the first match as the featured match if available
        if (this.recentMatches.length > 0) {
          this.featuredMatch = this.recentMatches[0];
        }
        
        this.loading = false;
      },
      error: (err) => {
        console.error("Error loading played matches:", err);
        this.loading = false;
      },
    });
    this.subscriptions.push(sub1);
    
    // Load upcoming matches
    const sub2 = this.matchService.getNotYetPlayedMatches().subscribe({
      next: (data) => {
        this.upcomingMatches = data.slice(0, 4); // Get the 4 upcoming matches
        
        // Process each match to ensure club logo URLs are correct
        this.upcomingMatches.forEach(match => {
          if (match.club1) this.setClubLogoUrl(match.club1);
          if (match.club2) this.setClubLogoUrl(match.club2);
        });
      },
      error: (err) => {
        console.error("Error loading upcoming matches:", err);
      },
    });
    this.subscriptions.push(sub2);
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
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  formatTime(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  }

  getWinnerStatus(match: Match, clubId: number): string {
    if (!match.goals1 || !match.goals2) return "";
    
    if (match.club1.idClub === clubId) {
      if (match.goals1 > match.goals2) return "(win)";
      if (match.goals1 < match.goals2) return "(loss)";
      return "(draw)";
    } else {
      if (match.goals2 > match.goals1) return "(win)";
      if (match.goals2 < match.goals1) return "(loss)";
      return "(draw)";
    }
  }

  // getGoalScorers(match: Match, clubId: number): string[] {
  //   // This is a placeholder since we don't have goal scorer data
  //   // In a real application, you would fetch this data from your API
  //   return ["Player 1", "Player 2"];
  // }
}