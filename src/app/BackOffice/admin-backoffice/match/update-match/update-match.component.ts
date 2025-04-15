// // import { Component, Input, OnInit } from '@angular/core';
// // import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
// // import { ActivatedRoute, Router } from '@angular/router';
// // import { MatchService } from '../../../../services/serviceSuperAdmin/servicegerermatch/match.service';
// // import { CommonModule } from '@angular/common';

// // @Component({
// //   selector: 'app-updatematch',
// //   imports: [ReactiveFormsModule, CommonModule],
// //   templateUrl: './update-match.component.html',
// //   styleUrls: ['./update-match.component.css'],
// //   //standalone: true
// // })
// // export class UpdateMatchComponent implements OnInit {
// //   @Input() matchData: any;  // Input to receive the match data

// //   idMatch: any;
// //   matchForm!: FormGroup;
// //   successMessage: string = '';
// //   errorMessage: string = '';
// //   teams: string[] = ['Team A', 'Team B', 'Team C', 'Team D']; // List of teams

// //   constructor(private act: ActivatedRoute, private matchService: MatchService, private router: Router) { }

// //   ngOnInit(): void {
// //     this.idMatch = this.act.snapshot.params['idMatch'];

// //     // Initialize form group
// //     this.matchForm = new FormGroup({
// //       idMatch: new FormControl({ value: '', disabled: true }),  // Disable the id field
// //       resultatMatch: new FormControl('', [Validators.required]),
// //       dateMatch: new FormControl('', [Validators.required]),
// //       lieuMatch: new FormControl('', [Validators.required]),
// //       statusMatch: new FormControl('', [Validators.required]),
// //       typeMatch: new FormControl('', [Validators.required]),
// //       arbitre: new FormControl('', [Validators.required]),
// //       equipe1: new FormControl('', [Validators.required]),
// //       equipe2: new FormControl('', [Validators.required]),
// //     });

// //     // Load match data to edit
// //     this.matchService.getbyidMatchs(this.matchData.idMatch).subscribe((data) => {
// //       this.matchForm.patchValue(data);  // Populate the form with match data
// //     });
// //   }

// //   // Getter methods for form controls
// //   get resultatMatch() {
// //     return this.matchForm.get('resultatMatch');
// //   }

// //   get dateMatch() {
// //     return this.matchForm.get('dateMatch');
// //   }

// //   get lieuMatch() {
// //     return this.matchForm.get('lieuMatch');
// //   }

// //   get statusMatch() {
// //     return this.matchForm.get('statusMatch');
// //   }

// //   get typeMatch() {
// //     return this.matchForm.get('typeMatch');
// //   }

// //   get arbitre() {
// //     return this.matchForm.get('arbitre');
// //   }

// //   get equipe1() {
// //     return this.matchForm.get('equipe1');
// //   }

// //   get equipe2() {
// //     return this.matchForm.get('equipe2');
// //   }

// //   updateMatch() {
// //     if (this.matchForm.valid) {
// //       this.matchService.updateMatchs(this.matchData.idMatch, this.matchForm.value).subscribe({
// //         next: () => {
// //           this.successMessage = 'Match mis à jour avec succès !';
// //           this.errorMessage = '';
// //           this.matchForm.reset();
// //           this.router.navigate(['/list-match']);
// //         },
// //         error: () => {
// //           this.errorMessage = 'Erreur lors de la mise à jour du match.';
// //           this.successMessage = '';
// //         }
// //       });
// //     }
// //   }
// // }



// import { Component, type OnInit } from "@angular/core"
// import { FormBuilder, FormGroup, Validators } from "@angular/forms"
// import { ActivatedRoute, Router } from "@angular/router"
// import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service"
// import { Clubs } from "src/core/models/clubs"
// import { Match } from "src/core/models/match"


// @Component({
//   selector: "app-update-match",
//   templateUrl: "./update-match.component.html",
//   styleUrls: ["./update-match.component.css"],
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

//     this.matchId = +this.route.snapshot.paramMap.get("id")!
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
//       club1: club1,
//       club2: club2,
//     }

//     this.matchService.updateMatch(this.matchId, updatedMatch).subscribe({
//       next: () => {
//         this.loading = false
//         this.router.navigate(["/matches"])
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
// }








import { CommonModule } from "@angular/common"
import { Component, OnInit} from "@angular/core"
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service"
import { Clubs } from "src/core/models/clubs"
import { Match } from "src/core/models/match"


@Component({
  selector: "app-update-match",
  standalone : true,
  templateUrl: "./update-match.component.html",
  styleUrls: ["./update-match.component.css"],
  imports : [ReactiveFormsModule , CommonModule , ]
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
      club1: ["", Validators.required],
      club2: ["", Validators.required],
      goals1: [null],
      goals2: [null],
    })
  }

  loadClubs(): void {
    this.matchService.getAllClubs().subscribe({
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

    // Find the selected clubs by their IDs
    const club1 = this.clubs.find((club) => club.idClub === this.f["club1"].value)
    const club2 = this.clubs.find((club) => club.idClub === this.f["club2"].value)

    if (!club1 || !club2) {
      this.error = "Please select valid clubs"
      this.loading = false
      return
    }

    // Create match object
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
      club1: club1,
      club2: club2,
    }

    this.matchService.updateMatch(this.matchId, updatedMatch).subscribe({
      next: () => {
        this.loading = false
        this.router.navigate(["../../"], { relativeTo: this.route })
      },
      error: (err) => {
        this.loading = false
        this.error = "Failed to update match. Please try again."
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
    this.router.navigate(["../../"], { relativeTo: this.route })
  }
}
