// // src/app/components/cup/update-cup/update-cup.component.ts
// import { CommonModule } from "@angular/common"
// import { Component, OnInit } from "@angular/core"
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
// import { ActivatedRoute, Router } from "@angular/router"
// import { CupService } from "src/app/services/serviceCup/cup.service"
// import { ClubsService } from "src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service"
// import { Clubs } from "src/core/models/clubs"
// import { Cup } from "src/core/models/cup"

// @Component({
//   selector: "app-update-cup",
//   standalone: true,
//   templateUrl: "./update-cup.component.html",
//   styleUrls: ["./update-cup.component.css"],
//   imports: [CommonModule, ReactiveFormsModule],
// })
// export class UpdateCupComponent implements OnInit {
//   cupForm!: FormGroup
//   cupId!: number
//   cup: Cup | null = null
//   clubs: Clubs[] = []
//   participatingClubs: Clubs[] = []
//   selectedClubs: number[] = []
//   submitted = false
//   loading = false
//   loadingData = true
//   error = ""
//   successMessage = ""

//   constructor(
//     private formBuilder: FormBuilder,
//     private cupService: CupService,
//     private clubsService: ClubsService,
//     private router: Router,
//     private route: ActivatedRoute,
//   ) {}

//   ngOnInit(): void {
//     this.initForm()
//     this.cupId = +this.route.snapshot.paramMap.get("id")!
//     this.loadCup()
//     this.loadClubs()
//   }

//   initForm(): void {
//     this.cupForm = this.formBuilder.group({
//       name: ["", Validators.required],
//     })
//   }

//   loadCup(): void {
//     this.loadingData = true
//     this.cupService.getCupById(this.cupId).subscribe({
//       next: (data) => {
//         this.cup = data
//         this.populateForm()
//         this.loadParticipatingClubs()
//       },
//       error: (err) => {
//         this.error = "Failed to load cup details. Please try again."
//         console.error(err)
//         this.loadingData = false
//       },
//     })
//   }

//   loadParticipatingClubs(): void {
//     this.cupService.getParticipatingClubs(this.cupId).subscribe({
//       next: (data) => {
//         this.participatingClubs = data
//         // Initialize selectedClubs with IDs of participating clubs
//         this.selectedClubs = this.participatingClubs.map((club) => club.idClub)
//         this.loadingData = false
//       },
//       error: (err) => {
//         this.error = "Failed to load participating clubs. Please try again."
//         console.error(err)
//         this.loadingData = false
//       },
//     })
//   }

//   populateForm(): void {
//     if (this.cup) {
//       this.cupForm.patchValue({
//         name: this.cup.name,
//       })
//     }
//   }

//   loadClubs(): void {
//     this.clubsService.getAllClubs().subscribe({
//       next: (data) => {
//         this.clubs = data
//       },
//       error: (err) => {
//         this.error = "Failed to load clubs. Please try again."
//         console.error(err)
//       },
//     })
//   }

//   // Convenience getter for easy access to form fields
//   get f() {
//     return this.cupForm.controls
//   }

//   isClubParticipating(clubId: number): boolean {
//     return this.selectedClubs.includes(clubId)
//   }

//   onClubSelectionChange(clubId: number, event: Event): void {
//     const checkbox = event.target as HTMLInputElement
//     if (checkbox.checked) {
//       this.selectedClubs.push(clubId)
//     } else {
//       this.selectedClubs = this.selectedClubs.filter((id) => id !== clubId)
//     }
//   }

//   isPowerOfTwo(n: number): boolean {
//     return (n & (n - 1)) === 0 && n > 0
//   }

//   // onSubmit(): void {
//   //   this.submitted = true
//   //   this.error = ""
//   //   this.successMessage = ""

//   //   // Stop here if form is invalid
//   //   if (this.cupForm.invalid) {
//   //     return
//   //   }

//   //   // Check if at least 2 clubs are selected and the number is a power of 2
//   //   if (this.selectedClubs.length < 2) {
//   //     this.error = "Please select at least two clubs."
//   //     return
//   //   }

//   //   if (!this.isPowerOfTwo(this.selectedClubs.length)) {
//   //     this.error = "The number of clubs must be a power of 2 (2, 4, 8, 16, 32, etc.)."
//   //     return
//   //   }

//   //   this.loading = true

//   //   // Create updated cup object
//   //   const updatedCup: Cup = {
//   //     ...this.cup,
//   //     name: this.f["name"].value,
//   //   }

//   //   // First update the cup details
//   //   this.cupService.updateCup(this.cupId, updatedCup).subscribe({
//   //     next: (updatedData) => {
//   //       this.cup = updatedData
//   //       this.successMessage = "Cup tournament updated successfully!"
//   //       this.loading = false

//   //       setTimeout(() => {
//   //         this.router.navigate(["/superadmin/showcup"])
//   //       }, 1500)
//   //     },
//   //     error: (err) => {
//   //       this.loading = false
//   //       this.error = "Failed to update cup tournament. Please try again."
//   //       console.error(err)
//   //     },
//   //   })
//   // }













//   onSubmit(): void {
//     this.submitted = true
//     this.error = ""
//     this.successMessage = ""
  
//     if (this.cupForm.invalid) {
//       return
//     }
  
//     if (this.selectedClubs.length < 2) {
//       this.error = "Please select at least two clubs."
//       return
//     }
  
//     if (!this.isPowerOfTwo(this.selectedClubs.length)) {
//       this.error = "The number of clubs must be a power of 2 (2, 4, 8, 16, 32, etc.)."
//       return
//     }
  
//     if (!this.cup) {
//       this.error = "Cup data is not loaded."
//       return
//     }
  
//     this.loading = true
  
//     const updatedCup: Cup = {
//       idCup: this.cup.idCup, // ici on s'assure que c'est bien un number
//       name: this.f["name"].value,
//       matchs: this.cup.matchs ?? [],
//     }
  
//     this.cupService.updateCup(this.cupId, updatedCup).subscribe({
//       next: (updatedData) => {
//         this.cup = updatedData
//         this.successMessage = "Cup tournament updated successfully!"
//         this.loading = false
  
//         setTimeout(() => {
//           this.router.navigate(["/superadmin/showcup"])
//         }, 1500)
//       },
//       error: (err) => {
//         this.loading = false
//         this.error = "Failed to update cup tournament. Please try again."
//         console.error(err)
//       },
//     })
//   }
  

//   cancel(): void {
//     this.router.navigate(["/superadmin/showcup"])
//   }
// }



// src/app/components/cup/update-cup/update-cup.component.ts
import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { catchError, of, retry } from "rxjs"
import { CupService } from "src/app/services/serviceCup/cup.service"
import { Clubs } from "src/core/models/clubs"
import { Cup } from "src/core/models/cup"

@Component({
  selector: "app-update-cup",
  standalone: true,
  templateUrl: "./update-cup.component.html",
  styleUrls: ["./update-cup.component.css"],
  imports: [CommonModule, ReactiveFormsModule],
})
export class UpdateCupComponent implements OnInit {
  cupForm!: FormGroup
  cupId!: number
  cup!: Cup
  participatingClubs: Clubs[] = []
  submitted = false
  loading = false
  loadingData = true
  error = ""
  successMessage = ""

  constructor(
    private formBuilder: FormBuilder,
    private cupService: CupService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.cupId = +this.route.snapshot.paramMap.get("id")!
    this.loadCup()
  }

  initForm(): void {
    this.cupForm = this.formBuilder.group({
      name: ["", Validators.required],
    })
  }

  loadCup(): void {
    this.loadingData = true
    this.error = ""

    this.cupService
      .getCupById(this.cupId)
      .pipe(
        retry(2),
        catchError((err) => {
          this.error = "Failed to load cup data."
          this.loadingData = false
          return of(null)
        }),
      )
      .subscribe((data) => {
        if (data) {
          this.cup = data
          this.populateForm()
          this.loadParticipatingClubs()
        }
        this.loadingData = false
      })
  }

  populateForm(): void {
    if (this.cup) {
      this.cupForm.patchValue({
        name: this.cup.name ?? "",
      })
    }
  }

  loadParticipatingClubs(): void {
    this.cupService
      .getParticipatingClubs(this.cupId)
      .pipe(catchError(() => of([])))
      .subscribe((data) => {
        this.participatingClubs = data
      })
  }

  get f() {
    return this.cupForm.controls
  }

  onSubmit(): void {
    this.submitted = true
    this.error = ""
    this.successMessage = ""

    if (this.cupForm.invalid) {
      return
    }

    this.loading = true

    const updatedCup: Cup = {
      ...this.cup,
      name: this.f["name"].value,
    }

    this.cupService
      .updateCup(this.cupId, updatedCup)
      .pipe(
        catchError((err) => {
          this.loading = false
          this.error = "Failed to update cup. Please try again."
          return of(null)
        }),
      )
      .subscribe((res) => {
        if (res) {
          this.loading = false
          this.successMessage = "Cup tournament updated successfully!"
          setTimeout(() => {
            // First navigate back to the previous route
            this.router.navigate(["/superadmin/showcup"]).then(() => {
              // Reload the page once you've navigated
              window.location.reload()
            })
          }, 1500)
        }
      })
  }

  cancel(): void {
    this.router.navigate(["/superadmin/showcup"])
  }
}

