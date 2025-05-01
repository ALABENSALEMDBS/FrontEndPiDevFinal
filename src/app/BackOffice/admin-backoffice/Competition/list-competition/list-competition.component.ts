// import { CommonModule } from "@angular/common"
// import { Component, OnInit} from "@angular/core"
// import { ReactiveFormsModule } from "@angular/forms"
// import { ActivatedRoute, Router, RouterModule } from "@angular/router"
// import { CompetitionService } from "src/app/services/serviceCompetition/competition.service"
// import { Competition } from "src/core/models/competition"

// @Component({
//   selector: "app-list-competition",
//   standalone: true,
//   templateUrl: "./list-competition.component.html",
//   styleUrls: ["./list-competition.component.css"],
//   imports: [CommonModule, ReactiveFormsModule, RouterModule],
// })
// export class ListCompetitionComponent implements OnInit {
//   competitions: Competition[] = []
//   filteredCompetitions: Competition[] = []
//   loading = true
//   error = ""
//   filterType = "all" // all, league, cup

//   constructor(
//     private competitionService: CompetitionService,
//     private router: Router,
//     private route: ActivatedRoute,
//   ) {}

//   ngOnInit(): void {
//     this.loadCompetitions()
//   }

//   loadCompetitions(): void {
//     this.loading = true
//     this.competitionService.getAllCompetitions().subscribe({
//       next: (data) => {
//         this.competitions = data
//         this.applyFilter(this.filterType)
//         this.loading = false
//       },
//       error: (err) => {
//         this.error = "Failed to load competitions. Please try again."
//         console.error(err)
//         this.loading = false
//       },
//     })
//   }

//   applyFilter(filterType: string): void {
//     this.filterType = filterType

//     switch (filterType) {
//       case "league":
//         this.filteredCompetitions = this.competitions.filter(
//           (competition) => competition.TypeC?.toUpperCase() === "LIGUE",
//         )
//         break
//       case "cup":
//         this.filteredCompetitions = this.competitions.filter(
//           (competition) => competition.TypeC?.toUpperCase() === "COUPE",
//         )
//         break
//       default:
//         this.filteredCompetitions = this.competitions
//         break
//     }
//   }

//   editCompetition(id: number): void {
//     this.router.navigate(["update", id], { relativeTo: this.route })
//   }

//   deleteCompetition(id: number): void {
//     if (confirm("Are you sure you want to delete this competition?")) {
//       this.competitionService.deleteCompetition(id).subscribe({
//         next: () => {
//           this.competitions = this.competitions.filter((competition) => competition.idCompetition !== id)
//           this.applyFilter(this.filterType)
//         },
//         error: (err) => {
//           this.error = "Failed to delete competition. Please try again."
//           console.error(err)
//         },
//       })
//     }
//   }

//   viewMatches(id: number): void {
//     this.router.navigate(["matches", id], { relativeTo: this.route })
//   }

//   viewParticipatingClubs(id: number): void {
//     this.router.navigate(["clubs", id], { relativeTo: this.route })
//   }

//   addNewCompetition(): void {
//     this.router.navigate(["add"], { relativeTo: this.route })
//   }

//   getTypeClass(type: string): string {
//     switch (type?.toUpperCase()) {
//       case "LIGUE":
//         return "badge bg-primary"
//       case "COUPE":
//         return "badge bg-success"
//       case "AMICAL":
//         return "badge bg-info"
//       default:
//         return "badge bg-secondary"
//     }
//   }
// }








import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CompetitionService } from 'src/app/services/serviceCompetition/competition.service';
import { Competition } from 'src/core/models/competition';


@Component({
  selector: 'app-list-competition',
  standalone: true,
  templateUrl: './list-competition.component.html',
  styleUrls: ['./list-competition.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ListCompetitionComponent implements OnInit {
  competitions: Competition[] = [];
  filteredCompetitions: Competition[] = [];
  loading = true;
  error = '';
  filterType = 'all'; // all, league, cup

  constructor(
    private competitionService: CompetitionService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadCompetitions();
  }

  loadCompetitions(): void {
    this.loading = true;
    this.competitionService.getAllCompetitions().subscribe({
      next: (data) => {
        this.competitions = data;
        this.applyFilter(this.filterType);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load competitions. Please try again.';
        console.error(err);
        this.loading = false;
      },
    });
  }

  applyFilter(filterType: string): void {
    this.filterType = filterType;

    switch (filterType) {
      case 'league':
        this.filteredCompetitions = this.competitions.filter(
          (competition) => competition.TypeC?.toUpperCase() === 'LIGUE',
        );
        break;
      case 'cup':
        this.filteredCompetitions = this.competitions.filter(
          (competition) => competition.TypeC?.toUpperCase() === 'COUPE',
        );
        break;
      default:
        this.filteredCompetitions = this.competitions;
        break;
    }
  }

  editCompetition(id: number): void {
    this.router.navigate(['update', id], { relativeTo: this.route });
  }

  deleteCompetition(id: number): void {
    if (confirm('Are you sure you want to delete this competition?')) {
      this.competitionService.deleteCompetition(id).subscribe({
        next: () => {
          this.competitions = this.competitions.filter((competition) => competition.idCompetition !== id);
          this.applyFilter(this.filterType);
        },
        error: (err) => {
          this.error = 'Failed to delete competition. Please try again.';
          console.error(err);
        },
      });
    }
  }

  viewMatches(id: number): void {
    this.router.navigate(['matches', id], { relativeTo: this.route });
  }

  viewStandings(id: number): void {
    this.router.navigate(['standings', id], { relativeTo: this.route });
  }

  viewParticipatingClubs(id: number): void {
    this.router.navigate(['clubs', id], { relativeTo: this.route });
  }

  addNewCompetition(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  getTypeClass(type: string): string {
    switch (type?.toUpperCase()) {
      case 'LIGUE':
        return 'badge bg-primary';
      case 'COUPE':
        return 'badge bg-success';
      case 'AMICAL':
        return 'badge bg-info';
      default:
        return 'badge bg-secondary';
    }
  }
}