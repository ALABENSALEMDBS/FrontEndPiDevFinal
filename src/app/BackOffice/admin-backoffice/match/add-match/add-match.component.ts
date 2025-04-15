// import { Component, OnInit } from "@angular/core"
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
// import { Router } from "@angular/router"
// import { CommonModule } from "@angular/common"
// import { ClubsService } from "src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service"
// import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service"
// import { Clubs } from "src/core/models/clubs"
// import { Match } from "src/core/models/match"
// //import { Match } from "src/core/models/match"

// @Component({
//   selector: "app-add-match",
//   templateUrl: "./add-match.component.html",
//   styleUrls: ["./add-match.component.css"],
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
// })
// export class AddMatchComponent implements OnInit {
//   matchForm!: FormGroup
//   clubs: Clubs[] = []
//   submitted = false
//   loading = false
//   error = ""

//   // Dropdown options
//   statusOptions = ["Scheduled", "In Progress", "Completed", "Postponed", "Cancelled"]
//   typeOptions = ["Friendly", "League", "Cup", "Championship", "Playoff"]

//   constructor(
//     private formBuilder: FormBuilder,
//     private matchService: MatchService,
//     private router: Router,
//     private clubsService: ClubsService
//   ) {}

//   ngOnInit(): void {
//     this.initForm()
//     this.loadClubs()
//   }

//   initForm(): void {
//     this.matchForm = this.formBuilder.group({
//       dateMatch: ["", Validators.required],
//       lieuMatch: ["", Validators.required],
//       statusMatch: ["Scheduled", Validators.required],
//       typeMatch: ["", Validators.required],
//       arbitre: ["", Validators.required],
//       club1: ["", Validators.required],
//       club2: ["", Validators.required],
//     })
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

//   get f() {
//     return this.matchForm.controls
//   }

//   onSubmit(): void {
//     this.submitted = true

//     if (this.matchForm.invalid) return

//     this.loading = true

//     const club1 = this.clubs.find((club) => club.idClub == this.f["club1"].value)
//     const club2 = this.clubs.find((club) => club.idClub == this.f["club2"].value)

//     if (!club1 || !club2 || club1.idClub === club2.idClub) {
//       this.error = "Please select two different valid clubs."
//       this.loading = false
//       return
//     }

//     const match: Match = {
//       idMatch: 0, // Backend will assign
//       resultatMatch: "",
//       dateMatch: this.f["dateMatch"].value,
//       lieuMatch: this.f["lieuMatch"].value,
//       statusMatch: this.f["statusMatch"].value,
//       typeMatch: this.f["typeMatch"].value,
//       arbitre: this.f["arbitre"].value,
//       club1: club1,
//       club2: club2,
//     }

//     this.matchService.createMatch(match).subscribe({
//       next: () => {
//         this.loading = false
//         this.router.navigate(["/matches"])
//       },
//       error: (err) => {
//         this.loading = false
//         this.error = "Failed to create match. Please try again."
//         console.error(err)
//       },
//     })
//   }
//   // Prevent same club selection
//   onClub1Change(): void {
//     if (this.f["club1"].value === this.f["club2"].value) {
//       this.f["club2"].setValue("")
//     }
//   }

//   onClub2Change(): void {
//     if (this.f["club2"].value === this.f["club1"].value) {
//       this.f["club1"].setValue("")
//     }
//   }
// }


import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { Clubs } from "src/core/models/clubs"
import { Match } from "src/core/models/match"
import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service"
import { ClubsService } from "src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service"

@Component({
  selector: "app-add-match",
  standalone: true,
  templateUrl: "./add-match.component.html",
  styleUrls: ["./add-match.component.css"],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddMatchComponent implements OnInit {
  matchForm!: FormGroup
  clubs: Clubs[] = []
  submitted = false
  loading = false
  error = ""

  // Match status options
  statusOptions = ["Scheduled", "In Progress", "Completed", "Postponed", "Cancelled"]

  // Match type options
  typeOptions = ["Friendly", "League", "Cup", "Championship", "Playoff"]

  constructor(
    private formBuilder: FormBuilder,
    private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute,
    private clubService : ClubsService
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.loadClubs()
  }

  initForm(): void {
    this.matchForm = this.formBuilder.group({
      dateMatch: ["", Validators.required],
      lieuMatch: ["", Validators.required],
      statusMatch: ["Scheduled", Validators.required],
      typeMatch: ["", Validators.required],
      arbitre: ["", Validators.required],
      club1: ["", Validators.required],
      club2: ["", Validators.required],
    })
  }

  loadClubs(): void {
    this.clubService.getAllClubs().subscribe({
      next: (data) => {
        this.clubs = data
      },
      error: (err) => {
        this.error = "Failed to load clubs. Please try again."
        console.error(err)
      },
    })
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.matchForm.controls
  }

  onSubmit(): void {
    this.submitted = true

    // Stop here if form is invalid
    if (this.matchForm.invalid) {
      return
    }

    this.loading = true

    // Find the selected clubs by their IDs
    const club1 = this.clubs.find((club) => club.idClub === this.f["club1"].value)
    const club2 = this.clubs.find((club) => club.idClub === this.f["club2"].value)

    
    if (!club1 || !club2) {
      this.error = "Please select valid clubs"
      this.loading = false
      return
    }

    // Create match object
    const match: Match = {
      idMatch: 0, // This will be assigned by the backend
      resultatMatch: "", // Initially empty
      dateMatch: this.f["dateMatch"].value,
      lieuMatch: this.f["lieuMatch"].value,
      statusMatch: this.f["statusMatch"].value,
      typeMatch: this.f["typeMatch"].value,
      arbitre: this.f["arbitre"].value,
      goals1: null,
      goals2: null,
      club1: club1,
      club2: club2,
    }

    this.matchService.createMatch(match).subscribe({
      next: () => {
        this.loading = false
        // Navigate back to the list
        this.router.navigate(["../"], { relativeTo: this.route })
      },
      error: (err) => {
        this.loading = false
        this.error = "Failed to create match. Please try again."
        console.error(err)
      },
    })
  }

  // Prevent selecting the same club for both teams
  onClub1Change(): void {
    const club1Value = this.f["club1"].value
    const club2Value = this.f["club2"].value

    if (club1Value && club1Value === club2Value) {
      this.f["club2"].setValue("")
    }
  }

  onClub2Change(): void {
    const club1Value = this.f["club1"].value
    const club2Value = this.f["club2"].value

    if (club2Value && club1Value === club2Value) {
      this.f["club1"].setValue("")
    }
  }

  cancel(): void {
    this.router.navigate(["../"], { relativeTo: this.route })
  }
}
