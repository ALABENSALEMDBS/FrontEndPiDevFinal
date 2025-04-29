// src/app/components/club-display/club-display.component.ts
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service";
import { ClubsService } from "src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service";
import { Clubs } from "src/core/models/clubs";
import { Match } from "src/core/models/match";

@Component({
  selector: "app-club-display",
  standalone: true,
  templateUrl: "./club-display.component.html",
  styleUrls: ["./club-display.component.css"],
  imports: [CommonModule, RouterModule],
})
export class ClubDisplayComponent implements OnInit {
  clubs: Clubs[] = [];
  recentMatches: Match[] = [];
  upcomingMatches: Match[] = [];
  featuredMatch: Match | null = null;
  loading = true;
  error = "";
  currentPage = "Clubs & Matches";

  constructor(
    private clubsService: ClubsService,
    private matchService: MatchService
  ) {}

  ngOnInit(): void {
    this.loadClubs();
    this.loadMatches();
  }

  loadClubs(): void {
    this.clubsService.getAllClubs().subscribe({
      next: (data) => {
        this.clubs = data;
      },
      error: (err) => {
        this.error = "Failed to load clubs. Please try again.";
        console.error(err);
      },
    });
  }

  loadMatches(): void {
    this.loading = true;
    
    // Load played matches for recent matches
    this.matchService.getPlayedMatches().subscribe({
      next: (data) => {
        this.recentMatches = data.slice(0, 5); // Get the 5 most recent matches
        
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
    
    // Load upcoming matches
    this.matchService.getNotYetPlayedMatches().subscribe({
      next: (data) => {
        this.upcomingMatches = data.slice(0, 4); // Get the 4 upcoming matches
      },
      error: (err) => {
        console.error("Error loading upcoming matches:", err);
      },
    });
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

  getGoalScorers(match: Match, clubId: number): string[] {
    // This is a placeholder since we don't have goal scorer data
    // In a real application, you would fetch this data from your API
    return ["Player 1", "Player 2"];
  }

}