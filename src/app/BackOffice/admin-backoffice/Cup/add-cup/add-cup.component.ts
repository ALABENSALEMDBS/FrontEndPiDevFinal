
// // import { CommonModule } from '@angular/common';
// // import { Component, OnInit } from '@angular/core';
// // import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// // import { Router, ActivatedRoute, RouterModule } from '@angular/router';
// // import { CupService } from 'src/app/services/serviceCup/cup.service';
// // import { ClubsService } from 'src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service';
// // import { Clubs } from 'src/core/models/clubs';

// // @Component({
// //   selector: 'app-add-cup',
// //   standalone: true,
// //   templateUrl: './add-cup.component.html',
// //   styleUrls: ['./add-cup.component.css'],
// //   imports: [CommonModule, ReactiveFormsModule, RouterModule],
// // })
// // export class AddCupComponent implements OnInit {
// //   cupForm!: FormGroup;
// //   clubs: Clubs[] = [];
// //   selectedClubs: Clubs[] = [];
// //   loading = false;
// //   loadingClubs = true;
// //   error = '';
// //   successMessage = '';
// //   submitted = false;

// //   constructor(
// //     private formBuilder: FormBuilder,
// //     private cupService: CupService,
// //     private clubService: ClubsService,
// //     private router: Router,
// //     private route: ActivatedRoute,
// //   ) {}

// //   ngOnInit(): void {
// //     this.initForm();
// //     this.loadClubs();
// //   }

// //   initForm(): void {
// //     this.cupForm = this.formBuilder.group({
// //       name: ['', [Validators.required, Validators.minLength(3)]],
// //     });
// //   }

// //   loadClubs(): void {
// //     this.loadingClubs = true;
// //     this.clubService.getAllClubs().subscribe({
// //       next: (data) => {
// //         this.clubs = data;
// //         this.loadingClubs = false;
// //       },
// //       error: (err) => {
// //         this.error = 'Failed to load clubs. Please try again.';
// //         console.error(err);
// //         this.loadingClubs = false;
// //       },
// //     });
// //   }

// //   toggleClubSelection(club: Clubs): void {
// //     const index = this.selectedClubs.findIndex(c => c.idClub === club.idClub);
    
// //     if (index === -1) {
// //       this.selectedClubs.push(club);
// //     } else {
// //       this.selectedClubs.splice(index, 1);
// //     }
// //   }

// //   isClubSelected(club: Clubs): boolean {
// //     return this.selectedClubs.some(c => c.idClub === club.idClub);
// //   }

// //   isPowerOfTwo(n: number): boolean {
// //     return n > 0 && (n & (n - 1)) === 0;
// //   }

// //   onSubmit(): void {
// //     this.submitted = true;
// //     this.error = '';
// //     this.successMessage = '';

// //     // Stop here if form is invalid
// //     if (this.cupForm.invalid) {
// //       return;
// //     }

// //     // Check if number of selected clubs is a power of 2 (2, 4, 8, 16, etc.)
// //     if (!this.isPowerOfTwo(this.selectedClubs.length)) {
// //       this.error = `Number of clubs must be a power of 2 (2, 4, 8, 16, etc.). You selected ${this.selectedClubs.length} clubs.`;
// //       return;
// //     }

// //     // Check if at least 2 clubs are selected
// //     if (this.selectedClubs.length < 2) {
// //       this.error = 'Please select at least 2 clubs for the cup.';
// //       return;
// //     }

// //     this.loading = true;

// //     const clubIds = this.selectedClubs.map(club => club.idClub);
    
// //     this.cupService.createCup(this.cupForm.value.name, clubIds).subscribe({
// //       next: (response) => {
// //         this.loading = false;
// //         this.successMessage = 'Cup created successfully!';
        
// //         setTimeout(() => {
// //           this.router.navigate(['../'], { relativeTo: this.route });
// //         }, 1500);
// //       },
// //       error: (err) => {
// //         this.loading = false;
// //         this.error = 'Failed to create cup. Please try again.';
// //         console.error(err);
// //       },
// //     });
// //   }

// //   cancel(): void {
// //     this.router.navigate(['../'], { relativeTo: this.route });
// //   }
// // }




// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder ,  FormGroup,  FormsModule,  ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router, ActivatedRoute } from '@angular/router';
// import { CupService } from 'src/app/services/serviceCup/cup.service';
// import { ClubsService } from 'src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service';
// import { Clubs } from 'src/core/models/clubs';


// @Component({
//   selector: 'app-add-cup',
//   templateUrl: './add-cup.component.html',
//   styleUrls: ['./add-cup.component.css'],
//     imports: [CommonModule, ReactiveFormsModule ,  FormsModule],
//     standalone: true,
// })
// export class AddCupComponent implements OnInit {
//   cupForm!: FormGroup;
//   clubs: Clubs[] = [];
//   selectedClubs: number[] = [];
//   loading = false;
//   loadingClubs = true;
//   error = '';
//   successMessage = '';
//   submitted = false;

//   constructor(
//     private formBuilder: FormBuilder,
//     private cupService: CupService,
//     private clubsService: ClubsService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) {}

//   ngOnInit(): void {
//     this.initForm();
//     this.loadClubs();
//   }

//   initForm(): void {
//     this.cupForm = this.formBuilder.group({
//       name: ['', Validators.required]
//     });
//   }

//   loadClubs(): void {
//     this.loadingClubs = true;
//     this.clubsService.getAllClubs().subscribe({
//       next: (data) => {
//         this.clubs = data;
//         this.loadingClubs = false;
//       },
//       error: (err) => {
//         this.error = 'Failed to load clubs. Please try again.';
//         console.error(err);
//         this.loadingClubs = false;
//       }
//     });
//   }

//   toggleClubSelection(clubId: number): void {
//     const index = this.selectedClubs.indexOf(clubId);
//     if (index === -1) {
//       this.selectedClubs.push(clubId);
//     } else {
//       this.selectedClubs.splice(index, 1);
//     }
//   }

//   isPowerOfTwo(n: number): boolean {
//     return n > 0 && (n & (n - 1)) === 0;
//   }

//   onSubmit(): void {
//     this.submitted = true;
//     this.error = '';
//     this.successMessage = '';

//     // Stop here if form is invalid
//     if (this.cupForm.invalid) {
//       return;
//     }

//     // Check if number of selected clubs is a power of 2
//     if (!this.isPowerOfTwo(this.selectedClubs.length)) {
//       this.error = 'Number of selected clubs must be a power of 2 (2, 4, 8, 16, 32, etc.)';
//       return;
//     }

//     this.loading = true;

//     const cupName = this.cupForm.get('name')?.value;

//     this.cupService.createCup(cupName, this.selectedClubs).subscribe({
//       next: () => {
//         this.loading = false;
//         this.successMessage = 'Cup created successfully!';

//         setTimeout(() => {
//           this.router.navigate(['../'], { relativeTo: this.route });
//         }, 1500);
//       },
//       error: (err) => {
//         this.loading = false;
//         this.error = 'Failed to create cup. Please try again.';
//         console.error(err);
//       }
//     });
//   }

//   cancel(): void {
//     this.router.navigate(['../'], { relativeTo: this.route });
//   }
// }
















// src/app/components/cup/add-cup/add-cup.component.ts
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CupService } from "src/app/services/serviceCup/cup.service";
import { ClubsService } from "src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service";
import { Clubs } from "src/core/models/clubs";

@Component({
  selector: "app-add-cup",
  standalone: true,
  templateUrl: "./add-cup.component.html",
  styleUrls: ["./add-cup.component.css"],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddCupComponent implements OnInit {
  cupForm!: FormGroup;
  clubs: Clubs[] = [];
  selectedClubs: number[] = [];
  submitted = false;
  loading = false;
  error = "";
  successMessage = "";

  constructor(
    private formBuilder: FormBuilder,
    private cupService: CupService,
    private clubsService: ClubsService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadClubs();
  }

  initForm(): void {
    this.cupForm = this.formBuilder.group({
      name: ["", Validators.required],
    });
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

  // Convenience getter for easy access to form fields
  get f() {
    return this.cupForm.controls;
  }

  onClubSelectionChange(clubId: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedClubs.push(clubId);
    } else {
      this.selectedClubs = this.selectedClubs.filter((id) => id !== clubId);
    }
  }

  isPowerOfTwo(n: number): boolean {
    return (n & (n - 1)) === 0 && n > 0;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = "";
    this.successMessage = "";
  
    // Stop here if form is invalid
    if (this.cupForm.invalid) {
      return;
    }
  
    // Check if at least 2 clubs are selected and the number is a power of 2
    if (this.selectedClubs.length < 2) {
      this.error = "Please select at least two clubs.";
      return;
    }

    if (!this.isPowerOfTwo(this.selectedClubs.length)) {
      this.error = "The number of clubs must be a power of 2 (2, 4, 8, 16, 32, etc.).";
      return;
    }
  
    this.loading = true;
  
    const cupData = {
      name: this.f["name"].value,
      clubIds: this.selectedClubs,
    };
  
    this.cupService.createCup(cupData).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = "Cup tournament created successfully!";
        
        setTimeout(() => {
          this.router.navigate(["../"], { relativeTo: this.route });
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error || "Failed to create cup tournament. Please try again.";
        console.error(err);
      },
    });
  }

  cancel(): void {
    this.router.navigate(["../"], { relativeTo: this.route });
  }
}