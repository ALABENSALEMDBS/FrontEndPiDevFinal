
// // import { Component, OnInit } from '@angular/core';
// // import { MatchService } from '../../../../services/serviceSuperAdmin/servicegerermatch/match.service';
// // import { Match } from '../../../../../core/models/match';
// // import { RouterLink, RouterOutlet } from '@angular/router';
// // import { CommonModule } from '@angular/common';
// // import { ReactiveFormsModule } from '@angular/forms';
// // import { ClubsService } from '../../../../services/serviceSuperAdmin/servicegererclubs/clubs.service';


// // @Component({
// //   selector: 'app-list-match',
// //   imports:[RouterOutlet,CommonModule,RouterLink,ReactiveFormsModule],
// //   templateUrl: './list-match.component.html',
// //   styleUrls: ['./list-match.component.css']
// // })
// // export class ListMatchComponent implements OnInit {
// //  match: Match[] = [];
// //   constructor(private MatchService: MatchService , private clubService: ClubsService) {}


// //   ngOnInit(): void {
// //     this.getMatchs();
// //     console.log(this.getClubs())
    
// //   }

// //   getMatchs(): void {
// //     this.MatchService.getAllMatches().subscribe(data => {
// //       this.match = data;
// //       console.log(this.match);
// //     });
// //   }

// //   deleteMatchs(id:any){
// //     this.MatchService.delMatchs(id).subscribe(()=>{
// //       console.log("deleted !!!!")
// //       window.location.reload()
// //     })
// //   }

// //   // getClubs(){
// //   //   this.clubService.getAllClubs();
// //   // }

// //   getClubs() {
// //     this.clubService.getAllClubs().subscribe(
// //       (clubs) => {
// //         console.log(clubs); // This will print the fetched clubs
// //       },
// //       (error) => {
// //         console.error("Error fetching clubs:", error);
// //       }
// //     );
// //   }
  



// // }




// import { Component, type OnInit } from "@angular/core"
// import { Router } from "@angular/router"
// import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service"
// import { Match } from "src/core/models/match"



// @Component({
//   selector: "app-list-match",
//   templateUrl: "./list-match.component.html",
//   styleUrls: ["./list-match.component.css"],
// })
// export class ListMatchComponent implements OnInit {
//   matches: Match[] = []
//   filteredMatches: Match[] = []
//   loading = true
//   error = ""
//   filterType = "all" // all, played, upcoming

//   constructor(
//     private matchService: MatchService,
//     private router: Router,
//   ) {}

//   ngOnInit(): void {
//     this.loadMatches()
//   }

//   loadMatches(): void {
//     this.loading = true
//     this.matchService.getAllMatches().subscribe({
//       next: (data) => {
//         this.matches = data
//         this.applyFilter(this.filterType)
//         this.loading = false
//       },
//       error: (err) => {
//         this.error = "Failed to load matches. Please try again."
//         console.error(err)
//         this.loading = false
//       },
//     })
//   }

//   applyFilter(filterType: string): void {
//     this.filterType = filterType

//     switch (filterType) {
//       case "played":
//         this.matchService.getPlayedMatches().subscribe({
//           next: (data) => {
//             this.filteredMatches = data
//           },
//           error: (err) => {
//             console.error("Error loading played matches:", err)
//             this.filteredMatches = this.matches.filter(
//               (match) => match.resultatMatch && match.resultatMatch.trim() !== "",
//             )
//           },
//         })
//         break
//       case "upcoming":
//         this.matchService.getNotYetPlayedMatches().subscribe({
//           next: (data) => {
//             this.filteredMatches = data
//           },
//           error: (err) => {
//             console.error("Error loading upcoming matches:", err)
//             this.filteredMatches = this.matches.filter(
//               (match) => !match.resultatMatch || match.resultatMatch.trim() === "",
//             )
//           },
//         })
//         break
//       default:
//         this.filteredMatches = this.matches
//         break
//     }
//   }

//   editMatch(id: number): void {
//     this.router.navigate(["/update-match", id])
//   }

//   deleteMatch(id: number): void {
//     if (confirm("Are you sure you want to delete this match?")) {
//       this.matchService.deleteMatch(id).subscribe({
//         next: () => {
//           this.matches = this.matches.filter((match) => match.idMatch !== id)
//           this.applyFilter(this.filterType)
//         },
//         error: (err) => {
//           this.error = "Failed to delete match. Please try again."
//           console.error(err)
//         },
//       })
//     }
//   }

//   updateGoals(match: Match): void {
//     this.router.navigate(["/update-goals", match.idMatch])
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

//   formatDate(dateString: string): string {
//     if (!dateString) return ""
//     const date = new Date(dateString)
//     return date.toLocaleString()
//   }
// }









import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { ReactiveFormsModule } from "@angular/forms"
import { ActivatedRoute, Router, RouterModule } from "@angular/router"
import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service"
import { Match } from "src/core/models/match"


@Component({
  selector: "app-list-matches",
  standalone :true,
  templateUrl: "./list-match.component.html",
  styleUrls: ["./list-match.component.css"],
  imports: [CommonModule, ReactiveFormsModule ,RouterModule],
})
export class ListMatchComponent implements OnInit {
  matches: Match[] = []
  filteredMatches: Match[] = []
  loading = true
  error = ""
  filterType = "all" // all, played, upcoming

  constructor(
    private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadMatches()
  }

  loadMatches(): void {
    this.loading = true
    this.matchService.getAllMatches().subscribe({
      next: (data) => {
        this.matches = data
        this.applyFilter(this.filterType)
        this.loading = false
      },
      error: (err) => {
        this.error = "Failed to load matches. Please try again."
        console.error(err)
        this.loading = false
      },
    })
  }

  applyFilter(filterType: string): void {
    this.filterType = filterType
    this.loading = true

    switch (filterType) {
      case "played":
        this.matchService.getPlayedMatches().subscribe({
          next: (data) => {
            this.filteredMatches = data
            this.loading = false
          },
          error: (err) => {
            console.error("Error loading played matches:", err)
            // Fallback to client-side filtering
            this.filteredMatches = this.matches.filter(
              (match) =>
                (match.resultatMatch && match.resultatMatch.trim() !== "") ||
                (match.goals1 !== null && match.goals2 !== null),
            )
            this.loading = false
          },
        })
        break
      case "upcoming":
        this.matchService.getNotYetPlayedMatches().subscribe({
          next: (data) => {
            this.filteredMatches = data
            this.loading = false
          },
          error: (err) => {
            console.error("Error loading upcoming matches:", err)
            // Fallback to client-side filtering
            this.filteredMatches = this.matches.filter(
              (match) =>
                (!match.resultatMatch || match.resultatMatch.trim() === "") &&
                (match.goals1 === null || match.goals2 === null),
            )
            this.loading = false
          },
        })
        break
      default:
        this.filteredMatches = this.matches
        this.loading = false
        break
    }
  }

  editMatch(id: number): void {
    this.router.navigate(["update", id], { relativeTo: this.route })
  }

  deleteMatch(id: number): void {
    if (confirm("Are you sure you want to delete this match?")) {
      this.matchService.deleteMatch(id).subscribe({
        next: () => {
          this.matches = this.matches.filter((match) => match.idMatch !== id)
          this.applyFilter(this.filterType)
        },
        error: (err) => {
          this.error = "Failed to delete match. Please try again."
          console.error(err)
        },
      })
    }
  }

  updateGoals(match: Match): void {
    this.router.navigate(["update-goals", match.idMatch], { relativeTo: this.route })
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

  formatDate(dateString: string): string {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  addNewMatch(): void {
    this.router.navigate(["addmatch"], { relativeTo: this.route })
  }
}
