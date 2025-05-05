// import { CommonModule } from "@angular/common";
// import { Component, OnInit, OnDestroy } from "@angular/core";
// import { ActivatedRoute, Router, RouterModule } from "@angular/router";
// import { CupService } from "src/app/services/serviceCup/cup.service";
// import { ClubsService } from "src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service";
// import { Cup } from "src/core/models/cup";
// import { Match } from "src/core/models/match";
// import { Subscription } from "rxjs";

// interface BracketRound {
//   name: string;
//   matches: Match[];
// }

// @Component({
//   selector: "app-cup-bracket-display",
//   standalone: true,
//   templateUrl: "./cup-bracket-display.component.html",
//   styleUrls: ["./cup-bracket-display.component.css"],
//   imports: [CommonModule, RouterModule],
// })
// export class CupBracketDisplayComponent implements OnInit, OnDestroy {
//   cupId!: number;
//   cup: Cup | null = null;
//   bracketRounds: BracketRound[] = [];
//   loading = true;
//   loadingWinner = false;
//   error = "";
//   currentPage = "";
//   tournamentWinner: any = null;
//   tournamentCompleted = false;

//   private baseLogoUrl = "http://localhost:8089/PiDevBackEndProject/club/uploads/";
//   private defaultLogoPath = "assets/images/default-club-logo.png";
//   private subscriptions: Subscription[] = [];

//   constructor(
//     private cupService: CupService,
//     private route: ActivatedRoute,
//     private router: Router,
//     private clubsService: ClubsService,
//   ) {}

//   ngOnInit(): void {
//     const idParam = this.route.snapshot.paramMap.get("id");
//     this.cupId = idParam ? +idParam : 0;

//     this.loadCup();
//     this.loadBracket();
//     this.loadTournamentWinner();
//   }

//   ngOnDestroy(): void {
//     this.subscriptions.forEach((sub) => sub.unsubscribe());
//   }

//   loadCup(): void {
//     const sub = this.cupService.getCupById(this.cupId).subscribe({
//       next: (data) => {
//         this.cup = data;
//         this.currentPage = `${data.name} - Tournament Bracket`;
//       },
//       error: (err) => {
//         this.error = "Failed to load cup details.";
//         console.error(err);
//       },
//     });
//     this.subscriptions.push(sub);
//   }

//   loadBracket(): void {
//     this.loading = true;
//     const sub = this.cupService.getMatchesByRound(this.cupId).subscribe({
//       next: (data) => {
//         this.bracketRounds = Object.entries(data).map(([roundName, matches]) => ({
//           name: roundName,
//           matches: matches,
//         }));

//         const roundOrder: Record<string, number> = {
//           Final: 1,
//           "Semi-Final": 2,
//           "Quarter-Final": 3,
//           "Round of 16": 4,
//           "Round of 32": 5,
//           "Round of 64": 6,
//         };

//         this.bracketRounds.sort((a, b) => {
//           const getOrderValue = (roundName: string): number => {
//             for (const key of Object.keys(roundOrder)) {
//               if (roundName.includes(key)) return roundOrder[key];
//             }
//             return 999;
//           };
//           return getOrderValue(a.name) - getOrderValue(b.name);
//         });

//         this.bracketRounds.forEach((round) => {
//           round.matches.forEach((match) => {
//             if (match.club1) this.setClubLogoUrl(match.club1);
//             if (match.club2) this.setClubLogoUrl(match.club2);
//             if (match.winner) this.setClubLogoUrl(match.winner);
//           });
//         });

//         this.loading = false;
//       },
//       error: (err) => {
//         this.error = "Failed to load bracket data. Please try again.";
//         console.error(err);
//         this.loading = false;
//       },
//     });

//     this.subscriptions.push(sub);
//   }

//   loadTournamentWinner(): void {
//     this.loadingWinner = true;
//     this.tournamentWinner = null;
//     this.tournamentCompleted = false;

//     const sub = this.cupService.getWinnerId(this.cupId).subscribe({
//       next: (winnerId) => {
//         if (winnerId) {
//           this.findWinnerClub(winnerId);
//           this.tournamentCompleted = true;
//           console.log("Winner ID is:", winnerId);
//         } else {
//           this.tournamentCompleted = false;
//           console.log("No winner yet.");
//         }
//         this.loadingWinner = false;
//       },
//       error: (err) => {
//         console.error("Failed to load tournament winner:", err);
//         this.loadingWinner = false;
//       },
//     });

//     this.subscriptions.push(sub);
//   }

//   findWinnerClub(winnerId: number): void {
//     const finalRound = this.bracketRounds.find((round) => round.name.includes("Final"));
//     if (finalRound && finalRound.matches.length > 0) {
//       const finalMatch = finalRound.matches[0];
//       if (finalMatch.club1?.idClub === winnerId) {
//         this.tournamentWinner = finalMatch.club1;
//       } else if (finalMatch.club2?.idClub === winnerId) {
//         this.tournamentWinner = finalMatch.club2;
//       }
//       if (this.tournamentWinner) {
//         this.setClubLogoUrl(this.tournamentWinner);
//         return;
//       }
//     }

//     for (const round of this.bracketRounds) {
//       for (const match of round.matches) {
//         if (match.club1?.idClub === winnerId) {
//           this.tournamentWinner = match.club1;
//         } else if (match.club2?.idClub === winnerId) {
//           this.tournamentWinner = match.club2;
//         }
//         if (this.tournamentWinner) {
//           this.setClubLogoUrl(this.tournamentWinner);
//           return;
//         }
//       }
//     }
//   }

//   setClubLogoUrl(club: any): void {
//     if (!club) return;

//     try {
//       if (club.mediaUrl) {
//         const cleanFilename = club.mediaUrl.replace(/^(\.\/)?uploadss[\\/]/i, "").trim();
//         const timestamp = new Date().getTime();
//         club.logo = `${this.baseLogoUrl}${cleanFilename}?t=${timestamp}&clubId=${club.idClub}`;
//       } else {
//         club.logo = this.defaultLogoPath;
//       }
//     } catch (error) {
//       console.error("Error setting logo URL for club:", club.nameClub, error);
//       club.logo = this.defaultLogoPath;
//     }
//   }

//   getClubLogoUrl(club: any): string {
//     if (!club) return this.defaultLogoPath;
//     return club.logo || this.defaultLogoPath;
//   }

//   getMatchResult(match: Match): string {
//     return match.goals1 !== null && match.goals2 !== null
//       ? `${match.goals1} - ${match.goals2}`
//       : "vs";
//   }

//   getMatchWinner(match: Match): string {
//     return match.winner?.nameClub || "";
//   }

//   hasWinner(match: Match): boolean {
//     return !!match.winner;
//   }

//   getMatchClass(match: Match): string {
//     const status = match.statusMatch?.toLowerCase() || "";
//     switch (status) {
//       case "completed":
//         return "match-completed";
//       case "in progress":
//         return "match-in-progress";
//       case "cancelled":
//         return "match-cancelled";
//       case "postponed":
//         return "match-postponed";
//       default:
//         return "match-pending";
//     }
//   }

//   formatDate(dateString: string): string {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     });
//   }

//   formatTime(dateString: string): string {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toLocaleTimeString("en-US", {
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   }
// }




























import { CommonModule } from "@angular/common"
import { Component, OnInit, OnDestroy } from "@angular/core"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { CupService } from "src/app/services/serviceCup/cup.service"
import { ClubsService } from "src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service"
import { Cup } from "src/core/models/cup"
import { Match } from "src/core/models/match"
import { Subscription } from "rxjs"

interface BracketRound {
  name: string
  matches: Match[]
}

@Component({
  selector: "app-cup-bracket-display",
  standalone: true,
  templateUrl: "./cup-bracket-display.component.html",
  styleUrls: ["./cup-bracket-display.component.css"],
  imports: [CommonModule, RouterModule],
})
export class CupBracketDisplayComponent implements OnInit, OnDestroy {
  cupId!: number
  cup: Cup | null = null
  bracketRounds: BracketRound[] = []
  loading = true
  loadingWinner = false
  error = ""
  currentPage = ""
  tournamentWinner: any = null
  tournamentCompleted = false
  winnerClubId: number | null = null

  private baseLogoUrl = "http://localhost:8089/PiDevBackEndProject/club/uploads/"
  private defaultLogoPath = "assets/images/default-club-logo.png"
  private subscriptions: Subscription[] = []

  constructor(
    private cupService: CupService,
    private route: ActivatedRoute,
    private router: Router,
    private clubsService: ClubsService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get("id")
    this.cupId = idParam ? +idParam : 0

    this.loadCup()
    this.loadTournamentWinner() // Load winner first
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  loadCup(): void {
    const sub = this.cupService.getCupById(this.cupId).subscribe({
      next: (data) => {
        this.cup = data
        this.currentPage = `${data.name} - Tournament Bracket`
      },
      error: (err) => {
        this.error = "Failed to load cup details."
        console.error(err)
      },
    })
    this.subscriptions.push(sub)
  }

  loadBracket(): void {
    this.loading = true
    const sub = this.cupService.getMatchesByRound(this.cupId).subscribe({
      next: (data) => {
        this.bracketRounds = Object.entries(data).map(([roundName, matches]) => ({
          name: roundName,
          matches: matches,
        }))

        const roundOrder: Record<string, number> = {
          Final: 1,
          "Semi-Final": 2,
          "Quarter-Final": 3,
          "Round of 16": 4,
          "Round of 32": 5,
          "Round of 64": 6,
        }

        this.bracketRounds.sort((a, b) => {
          const getOrderValue = (roundName: string): number => {
            for (const key of Object.keys(roundOrder)) {
              if (roundName.includes(key)) return roundOrder[key]
            }
            return 999
          }
          return getOrderValue(a.name) - getOrderValue(b.name)
        })

        this.bracketRounds.forEach((round) => {
          round.matches.forEach((match) => {
            if (match.club1) this.setClubLogoUrl(match.club1)
            if (match.club2) this.setClubLogoUrl(match.club2)
            if (match.winner) this.setClubLogoUrl(match.winner)
          })
        })

        // Now that we have the bracket data, find the winner if we have a winner ID
        if (this.winnerClubId) {
          this.findWinnerClub(this.winnerClubId)
        }

        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load bracket data. Please try again."
        console.error(err)
        this.loading = false
      },
    })

    this.subscriptions.push(sub)
  }

  loadTournamentWinner(): void {
    this.loadingWinner = true
    this.tournamentWinner = null
    this.tournamentCompleted = false
    this.winnerClubId = null

    const sub = this.cupService.getWinnerId(this.cupId).subscribe({
      next: (winnerId) => {
        console.log("Winner ID from backend:", winnerId)

        if (winnerId) {
          this.winnerClubId = winnerId
          this.tournamentCompleted = true

          // Load bracket data after getting winner ID
          this.loadBracket()
        } else {
          this.tournamentCompleted = false
          this.loadBracket() // Still load bracket data even if no winner
        }
        this.loadingWinner = false
      },
      error: (err) => {
        console.error("Failed to load tournament winner:", err)
        this.loadingWinner = false
        this.loadBracket() // Load bracket data even if there's an error
      },
    })

    this.subscriptions.push(sub)
  }

  findWinnerClub(winnerId: number): void {
    console.log("Finding winner club with ID:", winnerId)
    console.log("Bracket rounds:", this.bracketRounds)

    // First check the final round
    const finalRound = this.bracketRounds.find((round) => round.name === "Final" || round.name.includes("Final"))

    if (finalRound && finalRound.matches.length > 0) {
      const finalMatch = finalRound.matches[0]
      console.log("Final match:", finalMatch)

      if (finalMatch.club1 && finalMatch.club1.idClub === winnerId) {
        console.log("Winner found in final match (club1):", finalMatch.club1)
        this.tournamentWinner = finalMatch.club1
        this.setClubLogoUrl(this.tournamentWinner)
        return
      }

      if (finalMatch.club2 && finalMatch.club2.idClub === winnerId) {
        console.log("Winner found in final match (club2):", finalMatch.club2)
        this.tournamentWinner = finalMatch.club2
        this.setClubLogoUrl(this.tournamentWinner)
        return
      }
    }

    // If not found in final, search all matches
    for (const round of this.bracketRounds) {
      for (const match of round.matches) {
        if (match.club1 && match.club1.idClub === winnerId) {
          console.log("Winner found in round", round.name, "(club1):", match.club1)
          this.tournamentWinner = match.club1
          this.setClubLogoUrl(this.tournamentWinner)
          return
        }

        if (match.club2 && match.club2.idClub === winnerId) {
          console.log("Winner found in round", round.name, "(club2):", match.club2)
          this.tournamentWinner = match.club2
          this.setClubLogoUrl(this.tournamentWinner)
          return
        }
      }
    }

    // If still not found, fetch the club directly
    console.log("Winner not found in bracket data, fetching from service...")
    this.fetchWinnerClub(winnerId)
  }

  fetchWinnerClub(clubId: number): void {
    // Assuming you have a method in ClubsService to get a club by ID
    const sub = this.clubsService.getClubById(clubId).subscribe({
      next: (club) => {
        console.log("Fetched winner club:", club)
        this.tournamentWinner = club
        this.setClubLogoUrl(this.tournamentWinner)
      },
      error: (err) => {
        console.error("Failed to fetch winner club:", err)
      },
    })

    this.subscriptions.push(sub)
  }

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

  getMatchResult(match: Match): string {
    return match.goals1 !== null && match.goals2 !== null ? `${match.goals1} - ${match.goals2}` : "vs"
  }

  getMatchWinner(match: Match): string {
    return match.winner?.nameClub || ""
  }

  hasWinner(match: Match): boolean {
    return !!match.winner
  }

  getMatchClass(match: Match): string {
    const status = match.statusMatch?.toLowerCase() || ""
    switch (status) {
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
}
