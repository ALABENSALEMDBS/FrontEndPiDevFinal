// import { CommonModule } from "@angular/common"
// import { Component, OnInit} from "@angular/core"
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
// import { ActivatedRoute, Router } from "@angular/router"
// import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service"
// import { Clubs } from "src/core/models/clubs"
// import { Match } from "src/core/models/match"


// @Component({
//   selector: "app-update-match",
//   standalone : true,
//   templateUrl: "./update-match.component.html",
//   styleUrls: ["./update-match.component.css"],
//   imports : [ReactiveFormsModule , CommonModule , ]
// })
// export class UpdateMatchComponent implements OnInit {
//   matchForm!: FormGroup
//   matchId!: number
//   match!: Match
//   clubs: Clubs[] = []
//   submitted = false
//   loading = false
//   loadingData = true
//   error = ""

//   // Match status options
//   statusOptions = ["Scheduled", "In Progress", "Completed", "Postponed", "Cancelled"]

//   // Match type options
//   typeOptions = ["Friendly", "League", "Cup", "Championship", "Playoff"]

//   constructor(
//     private formBuilder: FormBuilder,
//     private matchService: MatchService,
//     private route: ActivatedRoute,
//     private router: Router,
//   ) {}

//   ngOnInit(): void {
//     this.initForm()
//     this.loadClubs()

//     this.matchId = +this.route.snapshot.paramMap.get("idMatch")!
//     this.loadMatch()
//   }

//   initForm(): void {
//     this.matchForm = this.formBuilder.group({
//       dateMatch: ["", Validators.required],
//       lieuMatch: ["", Validators.required],
//       statusMatch: ["", Validators.required],
//       typeMatch: ["", Validators.required],
//       arbitre: ["", Validators.required],
//       club1: ["", Validators.required],
//       club2: ["", Validators.required],
//       goals1: [null],
//       goals2: [null],
//     })
//   }

//   loadClubs(): void {
//     this.matchService.getAllClubs().subscribe({
//       next: (data) => {
//         this.clubs = data
//       },
//       error: (err) => {
//         this.error = "Failed to load clubs. Please try again."
//         console.error(err)
//       },
//     })
//   }

//   loadMatch(): void {
//     this.loadingData = true
//     this.matchService.getMatchById(this.matchId).subscribe({
//       next: (data) => {
//         this.match = data
//         this.populateForm()
//         this.loadingData = false
//       },
//       error: (err) => {
//         this.error = "Failed to load match details. Please try again."
//         console.error(err)
//         this.loadingData = false
//       },
//     })
//   }

//   populateForm(): void {
//     // Format date for input
//     let dateValue = this.match.dateMatch
//     if (dateValue && !dateValue.includes("T")) {
//       // If date doesn't have time component, add it
//       const date = new Date(dateValue)
//       dateValue = date.toISOString().slice(0, 16) // Format: YYYY-MM-DDTHH:MM
//     }

//     this.matchForm.patchValue({
//       dateMatch: dateValue,
//       lieuMatch: this.match.lieuMatch,
//       statusMatch: this.match.statusMatch,
//       typeMatch: this.match.typeMatch,
//       arbitre: this.match.arbitre,
//       club1: this.match.club1?.idClub,
//       club2: this.match.club2?.idClub,
//       goals1: this.match.goals1,
//       goals2: this.match.goals2,
//     })
//   }

//   // Convenience getter for easy access to form fields
//   get f() {
//     return this.matchForm.controls
//   }

//   onSubmit(): void {
//     this.submitted = true

//     // Stop here if form is invalid
//     if (this.matchForm.invalid) {
//       return
//     }

//     this.loading = true

//     // Find the selected clubs by their IDs
//     const club1 = this.clubs.find((club) => club.idClub === this.f["club1"].value)
//     const club2 = this.clubs.find((club) => club.idClub === this.f["club2"].value)

//     if (!club1 || !club2) {
//       this.error = "Please select valid clubs"
//       this.loading = false
//       return
//     }

//     // Create match object
//     const updatedMatch: Match = {
//       idMatch: this.matchId,
//       resultatMatch: this.match.resultatMatch,
//       dateMatch: this.f["dateMatch"].value,
//       lieuMatch: this.f["lieuMatch"].value,
//       statusMatch: this.f["statusMatch"].value,
//       typeMatch: this.f["typeMatch"].value,
//       arbitre: this.f["arbitre"].value,
//       goals1: this.f["goals1"].value,
//       goals2: this.f["goals2"].value,
//       competition : null,
//       club1: club1,
//       club2: club2,
//     }

//     this.matchService.updateMatch(this.matchId, updatedMatch).subscribe({
//       next: () => {
//         this.loading = false
//         this.router.navigate(["../../"], { relativeTo: this.route })
//       },
//       error: (err) => {
//         this.loading = false
//         this.error = "Failed to update match. Please try again."
//         console.error(err)
//       },
//     })
//   }

//   // Prevent selecting the same club for both teams
//   onClub1Change(): void {
//     const club1Value = this.f["club1"].value
//     const club2Value = this.f["club2"].value

//     if (club1Value && club1Value === club2Value) {
//       this.f["club2"].setValue("")
//     }
//   }

//   onClub2Change(): void {
//     const club1Value = this.f["club1"].value
//     const club2Value = this.f["club2"].value

//     if (club2Value && club1Value === club2Value) {
//       this.f["club1"].setValue("")
//     }
//   }

//   cancel(): void {
//     this.router.navigate(["../../"], { relativeTo: this.route })
//   }
// }





import { CommonModule } from "@angular/common"
import { Component, OnInit} from "@angular/core"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { ClubsService } from "src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service"
import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service"
import { Clubs } from "src/core/models/clubs"
import { Match } from "src/core/models/match"

@Component({
  selector: "app-update-match",
  standalone: true,
  templateUrl: "./update-match.component.html",
  styleUrls: ["./update-match.component.css"],
  imports: [ReactiveFormsModule, CommonModule]
})
export class UpdateMatchComponent implements OnInit {
  matchForm!: FormGroup
  matchId!: number
  match!: Match
  clubs: Clubs[] = []
  submitted = false
  loading = false
  loadingData = true
  error = ""

  // Match status options
  statusOptions = ["Scheduled", "In Progress", "Completed", "Postponed", "Cancelled"]

  // Match type options
  typeOptions = ["Friendly", "League", "Cup", "Championship", "Playoff"]

  constructor(
    private formBuilder: FormBuilder,
    private matchService: MatchService,
    private route: ActivatedRoute,
    private router: Router,
    private clubService: ClubsService
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.loadClubs()

    this.matchId = +this.route.snapshot.paramMap.get("idMatch")!
    this.loadMatch()
  }

  initForm(): void {
    this.matchForm = this.formBuilder.group({
      dateMatch: ["", Validators.required],
      lieuMatch: ["", Validators.required],
      statusMatch: ["", Validators.required],
      typeMatch: ["", Validators.required],
      arbitre: ["", Validators.required],
      // Remove validators from club1 and club2 since they'll be disabled
      club1: [{value: "", disabled: true}],
      club2: [{value: "", disabled: true}],
      goals1: [null],
      goals2: [null],
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

  loadMatch(): void {
    this.loadingData = true
    this.matchService.getMatchById(this.matchId).subscribe({
      next: (data) => {
        this.match = data
        this.populateForm()
        this.loadingData = false
      },
      error: (err) => {
        this.error = "Failed to load match details. Please try again."
        console.error(err)
        this.loadingData = false
      },
    })
  }

  populateForm(): void {
    // Format date for input
    let dateValue = this.match.dateMatch
    if (dateValue && !dateValue.includes("T")) {
      // If date doesn't have time component, add it
      const date = new Date(dateValue)
      dateValue = date.toISOString().slice(0, 16) // Format: YYYY-MM-DDTHH:MM
    }

    this.matchForm.patchValue({
      dateMatch: dateValue,
      lieuMatch: this.match.lieuMatch,
      statusMatch: this.match.statusMatch,
      typeMatch: this.match.typeMatch,
      arbitre: this.match.arbitre,
      club1: this.match.club1?.idClub,
      club2: this.match.club2?.idClub,
      goals1: this.match.goals1,
      goals2: this.match.goals2,
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

    // Create match object - use the original clubs from the match object
    const updatedMatch: Match = {
      idMatch: this.matchId,
      resultatMatch: this.match.resultatMatch,
      dateMatch: this.f["dateMatch"].value,
      lieuMatch: this.f["lieuMatch"].value,
      statusMatch: this.f["statusMatch"].value,
      typeMatch: this.f["typeMatch"].value,
      arbitre: this.f["arbitre"].value,
      goals1: this.f["goals1"].value,
      goals2: this.f["goals2"].value,
      competition: this.match.competition,
      // Use the original club objects from the loaded match
      club1: this.match.club1,
      club2: this.match.club2,
    }

    this.matchService.updateMatch(this.matchId, updatedMatch).subscribe({
      next: () => {
        this.loading = false
        this.router.navigate(["../../"], { relativeTo: this.route })
        console.log(this.match)
        window.location.reload();

      },
      error: (err) => {
        this.loading = false
        this.error = "Failed to update match. Please try again."
        console.error(err)
      },
    })
  }






  cancel(): void {
    this.router.navigate(["../../"], { relativeTo: this.route })
  }
}








