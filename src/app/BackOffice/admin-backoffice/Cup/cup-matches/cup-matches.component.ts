// // // // import { CommonModule } from '@angular/common';
// // // // import { Component, OnInit } from '@angular/core';
// // // // import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// // // // import { ActivatedRoute, Router } from '@angular/router';
// // // // import { CupService } from 'src/app/services/serviceCup/cup.service';
// // // // import { MatchService } from 'src/app/services/serviceSuperAdmin/servicegerermatch/match.service';
// // // // import { Cup } from 'src/core/models/cup';
// // // // import { Match } from 'src/core/models/match';

// // // // @Component({
// // // //   selector: 'app-cup-matches',
// // // //   templateUrl: './cup-matches.component.html',
// // // //   styleUrls: ['./cup-matches.component.css'],
// // // //         imports: [CommonModule, ReactiveFormsModule ,  FormsModule],
// // // //         standalone: true,
// // // // })
// // // // export class CupMatchesComponent implements OnInit {
// // // //   cupId!: number;
// // // //   cup!: Cup;
// // // //   matchesByRound: Record<string, MatchService[]> = {};
// // // //   roundOrder: string[] = ['Round 1', 'Round 2', 'Quarter-Final', 'Semi-Final', 'Final'];
// // // //   loading = true;
// // // //   error = '';
// // // //   successMessage = '';
// // // //   generatingNextRound = false;

// // // //   constructor(
// // // //     private cupService: CupService,
// // // //     private route: ActivatedRoute,
// // // //     private router: Router
// // // //   ) {}

// // // //   ngOnInit(): void {
// // // //     this.cupId = +this.route.snapshot.paramMap.get('id')!;
// // // //     this.loadCupDetails();
// // // //   }

// // // //   loadCupDetails(): void {
// // // //     this.loading = true;
// // // //     this.cupService.getCupById(this.cupId).subscribe({
// // // //       next: (data) => {
// // // //         this.cup = data;
// // // //         this.loadMatchesByRound();
// // // //       },
// // // //       error: (err) => {
// // // //         this.error = 'Failed to load cup details.';
// // // //         console.error(err);
// // // //         this.loading = false;
// // // //       }
// // // //     });
// // // //   }

// // // //   loadMatchesByRound(): void {
// // // //     this.cupService.getMatchesByRound(this.cupId).subscribe({
// // // //       next: (data) => {
// // // //         this.matchesByRound = data;
// // // //         this.loading = false;
// // // //       },
// // // //       error: (err) => {
// // // //         this.error = 'Failed to load matches. Please try again.';
// // // //         console.error(err);
// // // //         this.loading = false;
// // // //       }
// // // //     });
// // // //   }

// // // //   generateNextRound(): void {
// // // //     this.generatingNextRound = true;
// // // //     this.error = '';
// // // //     this.successMessage = '';

// // // //     this.cupService.generateNextRound(this.cupId).subscribe({
// // // //       next: (response) => {
// // // //         this.successMessage = response;
// // // //         this.loadMatchesByRound();
// // // //         this.generatingNextRound = false;
// // // //       },
// // // //       error: (err) => {
// // // //         this.error = err.error || 'Failed to generate next round. Please try again.';
// // // //         console.error(err);
// // // //         this.generatingNextRound = false;
// // // //       }
// // // //     });
// // // //   }

// // // //   updateMatchGoals(matchId: number): void {
// // // //     this.router.navigate(['/superadmin/showcup/update-goals', this.cupId, matchId]);
// // // //   }

// // // //   goBack(): void {
// // // //     this.router.navigate(['/superadmin/showcup']);
// // // //   }

// // // //   getWinnerClass(match: Match, clubNumber: number): string {
// // // //     if (!match.winner) return '';
    
// // // //     if (clubNumber === 1 && match.club1?.idClub === match.winner?.idClub) {
// // // //       return 'winner';
// // // //     }
    
// // // //     if (clubNumber === 2 && match.club2?.idClub === match.winner?.idClub) {
// // // //       return 'winner';
// // // //     }
    
// // // //     return 'loser';
// // // //   }

// // // //   isMatchComplete(match: Match): boolean {
// // // //     return match.winner !== null && match.winner !== undefined;
// // // //   }

// // // //   isRoundComplete(roundMatches: Match[]): boolean {
// // // //     return roundMatches.every(match => this.isMatchComplete(match));
// // // //   }

// // // //   isFinalRound(): boolean {
// // // //     return this.matchesByRound['Final']?.length === 1;
// // // //   }

// // // //   getTournamentWinner(): string {
// // // //     const finalMatch = this.matchesByRound['Final']?.[0];
// // // //     return finalMatch?.winner?.nameClub || 'Not determined yet';
// // // //   }
// // // // }









// // import { CommonModule } from '@angular/common';
// // import { Component, OnInit } from '@angular/core';
// // import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// // import { ActivatedRoute, Router } from '@angular/router';
// // import { CupService } from 'src/app/services/serviceCup/cup.service';
// // import { Cup } from 'src/core/models/cup';
// // import { Match } from 'src/core/models/match';

// // @Component({
// //   selector: 'app-cup-matches',
// //   templateUrl: './cup-matches.component.html',
// //   styleUrls: ['./cup-matches.component.css'],
// //   standalone: true,
// //   imports: [CommonModule, ReactiveFormsModule, FormsModule],
// // })
// // export class CupMatchesComponent implements OnInit {
// //   cupId!: number;
// //   cup!: Cup;
// //   matchesByRound: Record<string, Match[]> = {};
// //   roundOrder: string[] = ['Round 1', 'Round 2', 'Quarter-Final', 'Semi-Final', 'Final'];
// //   loading = true;
// //   error = '';
// //   successMessage = '';
// //   generatingNextRound = false;

// //   constructor(
// //     private cupService: CupService,
// //     private route: ActivatedRoute,
// //     private router: Router
// //   ) {}

// //   ngOnInit(): void {
// //     this.cupId = +this.route.snapshot.paramMap.get('id')!;
// //     this.loadCupDetails();
// //   }

// //   loadCupDetails(): void {
// //     this.loading = true;
// //     this.cupService.getCupById(this.cupId).subscribe({
// //       next: (data) => {
// //         this.cup = data;
// //         this.loadMatchesByRound();
// //       },
// //       error: (err) => {
// //         this.error = 'Failed to load cup details.';
// //         console.error(err);
// //         this.loading = false;
// //       }
// //     });
// //   }

// // //   loadMatchesByRound(): void {
// // //     this.cupService.getMatchesByRound(this.cupId).subscribe({
// // //       next: (data) => {
// // //         this.matchesByRound = data;
// // //         this.loading = false;
// // //       },
// // //       error: (err) => {
// // //         this.error = 'Failed to load matches. Please try again.';
// // //         console.error(err);
// // //         this.loading = false;
// // //       }
// // //     });
// // //   }

// // //   generateNextRound(): void {
// // //     this.generatingNextRound = true;
// // //     this.error = '';
// // //     this.successMessage = '';

// // //     this.cupService.generateNextRound(this.cupId).subscribe({
// // //       next: (response) => {
// // //         this.successMessage = response;
// // //         this.loadMatchesByRound();
// // //         this.generatingNextRound = false;
// // //       },
// // //       error: (err) => {
// // //         this.error = err.error || 'Failed to generate next round. Please try again.';
// // //         console.error(err);
// // //         this.generatingNextRound = false;
// // //       }
// // //     });
// // //   }

// // //   updateMatchGoals(matchId: number): void {
// // //     this.router.navigate(['/superadmin/showcup/update-goals', this.cupId, matchId]);
// // //   }

// // //   goBack(): void {
// // //     this.router.navigate(['/superadmin/showcup']);
// // //   }

// // //   getWinnerClass(match: Match, clubNumber: number): string {
// // //     if (!match.winner) return '';

// // //     const isWinner = 
// // //       (clubNumber === 1 && match.club1?.idClub === match.winner?.idClub) ||
// // //       (clubNumber === 2 && match.club2?.idClub === match.winner?.idClub);

// // //     return isWinner ? 'winner' : 'loser';
// // //   }

// // //   isMatchComplete(match: Match): boolean {
// // //     return !!match.winner;
// // //   }

// // //   isRoundComplete(roundMatches: Match[]): boolean {
// // //     return roundMatches.every(match => this.isMatchComplete(match));
// // //   }

// // //   isFinalRound(): boolean {
// // //     return this.matchesByRound['Final']?.length === 1;
// // //   }

// // //   getTournamentWinner(): string {
// // //     const finalMatch = this.matchesByRound['Final']?.[0];
// // //     return finalMatch?.winner?.nameClub || 'Not determined yet';
// // //   }
// // // }

















// // import { CommonModule } from '@angular/common';
// // import { Component, OnInit } from '@angular/core';
// // import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// // import { ActivatedRoute, Router } from '@angular/router';
// // import { CupService } from 'src/app/services/serviceCup/cup.service';
// // import { MatchService } from 'src/app/services/serviceSuperAdmin/servicegerermatch/match.service';
// // import { Cup } from 'src/core/models/cup';
// // import { Match } from 'src/core/models/match';

// // @Component({
// //   selector: 'app-cup-matches',
// //   templateUrl: './cup-matches.component.html',
// //   styleUrls: ['./cup-matches.component.css'],
// //   imports: [CommonModule, ReactiveFormsModule, FormsModule],
// //   standalone: true,
// // })
// // export class CupMatchesComponent implements OnInit {
// //   cupId!: number;
// //   cup!: Cup;
// //   matchesByRound: Record<string, Match[]> = {}; // Ensure proper type
// //   roundOrder: string[] = ['Round 1', 'Round 2', 'Quarter-Final', 'Semi-Final', 'Final'];
// //   loading = true;
// //   error = '';
// //   successMessage = '';
// //   generatingNextRound = false;

// //   constructor(
// //     private cupService: CupService,
// //     private route: ActivatedRoute,
// //     private router: Router
// //   ) {}

// //   ngOnInit(): void {
// //     this.cupId = +this.route.snapshot.paramMap.get('id')!;
// //     this.loadCupDetails();
// //   }

// //   loadCupDetails(): void {
// //     this.loading = true;
// //     this.cupService.getCupById(this.cupId).subscribe({
// //       next: (data) => {
// //         this.cup = data;
// //         this.loadMatchesByRound();
// //       },
// //       error: (err) => {
// //         this.error = 'Failed to load cup details.';
// //         console.error(err);
// //         this.loading = false;
// //       }
// //     });
// //   }

// //   loadMatchesByRound(): void {
// //     this.cupService.getMatchesByRound(this.cupId).subscribe({
// //       next: (data) => {
// //         this.matchesByRound = data;
// //         this.loading = false;
// //       },
// //       error: (err) => {
// //         this.error = 'Failed to load matches. Please try again.';
// //         console.error(err);
// //         this.loading = false;
// //       }
// //     });
// //   }

// //   generateNextRound(): void {
// //     this.generatingNextRound = true;
// //     this.error = '';
// //     this.successMessage = '';

// //     this.cupService.generateNextRound(this.cupId).subscribe({
// //       next: (response) => {
// //         this.successMessage = response;
// //         this.loadMatchesByRound();
// //         this.generatingNextRound = false;
// //       },
// //       error: (err) => {
// //         this.error = err.error || 'Failed to generate next round. Please try again.';
// //         console.error(err);
// //         this.generatingNextRound = false;
// //       }
// //     });
// //   }

// //   updateMatchGoals(matchId: number): void {
// //     this.router.navigate(['/superadmin/showcup/update-goals', this.cupId, matchId]);
// //   }

// //   goBack(): void {
// //     this.router.navigate(['/superadmin/showcup']);
// //   }

// //   getWinnerClass(match: Match, clubNumber: number): string {
// //     if (!match.winner) return '';
    
// //     if (clubNumber === 1 && match.club1?.idClub === match.winner?.idClub) {
// //       return 'winner';
// //     }
    
// //     if (clubNumber === 2 && match.club2?.idClub === match.winner?.idClub) {
// //       return 'winner';
// //     }
    
// //     return 'loser';
// //   }

// //   isMatchComplete(match: Match): boolean {
// //     return match.winner !== null && match.winner !== undefined;
// //   }

// //   isRoundComplete(roundMatches: Match[]): boolean {
// //     return roundMatches.every(match => this.isMatchComplete(match));
// //   }

// //   isFinalRound(): boolean {
// //     return this.matchesByRound['Final']?.length === 1;
// //   }

// //   getTournamentWinner(): string {
// //     const finalMatch = this.matchesByRound['Final']?.[0];
// //     return finalMatch?.winner?.nameClub || 'Not determined yet';
// //   }
// // }






// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CupService } from 'src/app/services/serviceCup/cup.service';
// import { Cup } from 'src/core/models/cup';
// import { Match } from 'src/core/models/match';

// @Component({
//   selector: 'app-cup-matches',
//   templateUrl: './cup-matches.component.html',
//   styleUrls: ['./cup-matches.component.css']
// })
// export class CupMatchesComponent implements OnInit {
//   cupId!: number;
//   cup!: Cup;
//   matchesByRound: Record<string, Match[]> = {};  // Initialize as an empty object
//   roundOrder: string[] = ['Round 1', 'Round 2', 'Quarter-Final', 'Semi-Final', 'Final'];
//   loading = true;
//   error = '';
//   successMessage = '';
//   generatingNextRound = false;

//   constructor(
//     private cupService: CupService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.cupId = +this.route.snapshot.paramMap.get('id')!;
//     this.loadCupDetails();
//   }

//   loadCupDetails(): void {
//     this.loading = true;
//     this.cupService.getCupById(this.cupId).subscribe({
//       next: (data) => {
//         this.cup = data;
//         this.loadMatchesByRound();
//       },
//       error: (err) => {
//         this.error = 'Failed to load cup details.';
//         console.error(err);
//         this.loading = false;
//       }
//     });
//   }

//   loadMatchesByRound(): void {
//     this.cupService.getMatchesByRound(this.cupId).subscribe({
//       next: (data) => {
//         this.matchesByRound = data || {}; // Ensure it's always an object
//         this.loading = false;
//       },
//       error: (err) => {
//         this.error = 'Failed to load matches. Please try again.';
//         console.error(err);
//         this.loading = false;
//       }
//     });
//   }

//   generateNextRound(): void {
//     // Logic for generating the next round
//   }

//   goBack(): void {
//     this.router.navigate(['/cups']); // Adjust the route as needed
//   }

//   isMatchComplete(match: Match): boolean {
//     return match.goals1 !== null && match.goals2 !== null; // Adjust based on your logic
//   }

//   isFinalRound(): boolean {
//     return this.roundOrder.indexOf('Final') === this.roundOrder.length - 1;
//   }

//   getTournamentWinner(): string {
//     // Logic to return the winner
//     return 'Winner Name'; // Replace with actual winner logic
//   }

//   getWinnerClass(match: Match, teamIndex: number): string {
//     // Logic to return the winning class
//     return ''; // Add your logic to determine the winner class
//   }

//   updateMatchGoals(matchId: number): void {
//     // Logic for updating match goals
//   }
// }




















// src/app/components/cup/cup-matches/cup-matches.component.ts
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CupService } from "src/app/services/serviceCup/cup.service";
import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service";
import { Cup } from "src/core/models/cup";
import { Match } from "src/core/models/match";

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
}