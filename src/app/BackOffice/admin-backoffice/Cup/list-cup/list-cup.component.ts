// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
// import { CupService } from 'src/app/services/serviceCup/cup.service';
// import { Cup } from 'src/core/models/cup';


// @Component({
//   selector: 'app-list-cup',
//   templateUrl: './list-cup.component.html',
//   styleUrls: ['./list-cup.component.css'],
//         imports: [CommonModule, ReactiveFormsModule ,  FormsModule ,RouterOutlet ],
//         standalone: true,
// })
// export class ListCupComponent implements OnInit {
//   cups: Cup[] = [];
//   loading = true;
//   error = '';

//   constructor(
//     private cupService: CupService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {}

//   ngOnInit(): void {
//     this.loadCups();
//   }

//   loadCups(): void {
//     this.loading = true;
//     this.cupService.getAllCups().subscribe({
//       next: (data) => {
//         this.cups = data;
//         this.loading = false;
//       },
//       error: (err) => {
//         this.error = 'Failed to load cups. Please try again.';
//         console.error(err);
//         this.loading = false;
//       }
//     });
//   }

//   deleteCup(id: number): void {
//     if (confirm('Are you sure you want to delete this cup?')) {
//       this.cupService.deleteCup(id).subscribe({
//         next: () => {
//           this.cups = this.cups.filter(cup => cup.idCup !== id);
//         },
//         error: (err) => {
//           this.error = 'Failed to delete cup. Please try again.';
//           console.error(err);
//         }
//       });
//     }
//   }

//   viewMatches(id: number): void {
//     this.router.navigate(['matches', id], { relativeTo: this.route });
//   }

//   addNewCup(): void {
//     this.router.navigate(['add'], { relativeTo: this.route });
//   }
// }












// src/app/components/cup/list-cup/list-cup.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CupService } from 'src/app/services/serviceCup/cup.service';
import { Cup } from 'src/core/models/cup';

@Component({
  selector: 'app-list-cup',
  standalone: true,
  templateUrl: './list-cup.component.html',
  styleUrls: ['./list-cup.component.css'],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
})
export class ListCupComponent implements OnInit {
  cups: Cup[] = [];
  loading = true;
  error = '';

  constructor(
    private cupService: CupService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loadCups();
  }

  loadCups(): void {
    this.loading = true;
    this.cupService.getAllCups().subscribe({
      next: (data) => {
        this.cups = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load cups. Please try again.';
        console.error(err);
        this.loading = false;
      },
    });
  }

  editCup(id: number): void {
    this.router.navigate(['update', id], { relativeTo: this.route });
  }

  deleteCup(id: number): void {
    if (confirm('Are you sure you want to delete this cup?')) {
      this.cupService.deleteCup(id).subscribe({
        next: () => {
          this.cups = this.cups.filter((cup) => cup.idCup !== id);
        },
        error: (err) => {
          this.error = 'Failed to delete cup. Please try again.';
          console.error(err);
        },
      });
    }
  }

  viewMatches(id: number): void {
    this.router.navigate(['matches', id], { relativeTo: this.route });
  }

  viewParticipatingClubs(id: number): void {
    this.router.navigate(['clubs', id], { relativeTo: this.route });
  }

  generateNextRound(id: number): void {
    if (confirm('Are you sure you want to generate the next round?')) {
      this.cupService.generateNextRound(id).subscribe({
        next: (response) => {
          alert('Next round generated successfully!');
          this.loadCups(); // Reload cups to reflect changes
        },
        error: (err) => {
          this.error = err.error || 'Failed to generate next round. Please try again.';
          console.error(err);
        },
      });
    }
  }

  addNewCup(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  viewBracket(id: number): void {
    this.router.navigate(['bracket', id], { relativeTo: this.route });
  }
}