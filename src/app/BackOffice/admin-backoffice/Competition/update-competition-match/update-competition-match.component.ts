// import { CommonModule } from "@angular/common"
// import { Component, type OnInit } from "@angular/core"
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
// import { ActivatedRoute, Router } from "@angular/router"
// import { CompetitionService } from "src/app/services/serviceCompetition/competition.service"
// import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service"
// import { Competition } from "src/core/models/competition"
// import { Match } from "src/core/models/match"


// @Component({
//   selector: "app-update-competition-match",
//   standalone: true,
//   templateUrl: "./update-competition-match.component.html",
//   styleUrls: ["./update-competition-match.component.css"],
//   imports: [CommonModule, ReactiveFormsModule],
// })
// export class UpdateCompetitionMatchComponent implements OnInit {
//   matchForm!: FormGroup
//   matchId!: number
//   competitionId!: number
//   match!: Match
//   competition: Competition | null = null
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
//     private competitionService: CompetitionService,
//     private route: ActivatedRoute,
//     private router: Router,
//   ) {}

//   ngOnInit(): void {
//     this.initForm()

//     // Get match ID and competition ID from route parameters
//     this.matchId = +this.route.snapshot.paramMap.get("matchId")!
//     this.competitionId = +this.route.snapshot.paramMap.get("competitionId")!

//     this.loadCompetition()
//     this.loadMatch()
//   }

//   initForm(): void {
//     this.matchForm = this.formBuilder.group({
//       dateMatch: ["", Validators.required],
//       lieuMatch: ["", Validators.required],
//       statusMatch: ["", Validators.required],
//       typeMatch: ["", Validators.required],
//       arbitre: ["", Validators.required],
//       goals1: [null],
//       goals2: [null],
//     })
//   }

//   loadCompetition(): void {
//     this.competitionService.getCompetitionById(this.competitionId).subscribe({
//       next: (data) => {
//         this.competition = data
//       },
//       error: (err) => {
//         this.error = "Failed to load competition details."
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

//     // Create match object - keep the original clubs
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
//       club1: this.match.club1,
//       club2: this.match.club2,
//       competition: this.match.competition || ({ idCompetition: this.competitionId } as Competition),
//     }

//     this.matchService.updateMatch(this.matchId, updatedMatch).subscribe({
//       next: () => {
//         this.loading = false
//         // Navigate back to competition matches
//         this.goBack()
//       },
//       error: (err) => {
//         this.loading = false
//         this.error = "Failed to update match. Please try again."
//         console.error(err)
//       },
//     })
//   }

//   goBack(): void {
//     this.router.navigate(["/superadmin/showcompetition/matches", this.competitionId])
//   }
// }







import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
//import { Component, OnInit } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CompetitionService } from "src/app/services/serviceCompetition/competition.service";
import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service";
import { Clubs } from "src/core/models/clubs";
import { Competition } from "src/core/models/competition";
import { Match } from "src/core/models/match";

@Component({
  selector: "app-update-competition-match",
  standalone: true,
  templateUrl: "./update-competition-match.component.html",
  styleUrls: ["./update-competition-match.component.css"],
  imports: [CommonModule, ReactiveFormsModule],
})
export class UpdateCompetitionMatchComponent implements OnInit {
  matchForm!: FormGroup;
  matchId!: number;
  competitionId!: number;
  match!: Match;
  competition!: Competition;
  clubs: Clubs[] = [];
  submitted = false;
  loading = false;
  loadingData = true;
  error = "";
  successMessage = "";

  // Match status options
  statusOptions = ["Scheduled", "In Progress", "Completed", "Postponed", "Cancelled"];

  // Match type options
  typeOptions = ["Friendly", "League", "Cup", "Championship", "Playoff"];

  constructor(
    private formBuilder: FormBuilder,
    private matchService: MatchService,
    private competitionService: CompetitionService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadParams();
    this.loadCompetition();
    this.loadMatch();
  }

  loadParams(): void {
    this.competitionId = +this.route.snapshot.paramMap.get("competitionId")!;
    this.matchId = +this.route.snapshot.paramMap.get("matchId")!;
  }

  initForm(): void {
    this.matchForm = this.formBuilder.group({
      dateMatch: ["", Validators.required],
      lieuMatch: ["", Validators.required],
      statusMatch: ["", Validators.required],
      typeMatch: ["", Validators.required],
      arbitre: ["", Validators.required],
      club1: [{value: "", disabled: true}],
      club2: [{value: "", disabled: true}],
      goals1: [null],
      goals2: [null],
    });
  }

  loadCompetition(): void {
    this.competitionService.getCompetitionById(this.competitionId).subscribe({
      next: (data) => {
        this.competition = data;
        this.loadParticipatingClubs();
      },
      error: (err) => {
        //this.error = "Failed to load competition details.";
        console.error(err);
      },
    });
  }

  loadParticipatingClubs(): void {
    this.competitionService.getParticipatingClubs(this.competitionId).subscribe({
      next: (data) => {
        this.clubs = data;
      },
      error: (err) => {
        this.error = "Failed to load participating clubs.";
        console.error(err);
      },
    });
  }

  loadMatch(): void {
    this.loadingData = true;
    this.matchService.getMatchById(this.matchId).subscribe({
      next: (data) => {
        this.match = data;
        this.populateForm();
        this.loadingData = false;
      },
      error: (err) => {
        //this.error = "Failed to load match details. Please try again.";
        console.error(err);
        this.loadingData = false;
      },
    });
  }

  populateForm(): void {
    // Format date for input
    let dateValue = this.match.dateMatch;
    if (dateValue && !dateValue.includes("T")) {
      // If date doesn't have time component, add it
      const date = new Date(dateValue);
      dateValue = date.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
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
    });
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.matchForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = "";
    this.successMessage = "";

    // Stop here if form is invalid
    if (this.matchForm.invalid) {
      return;
    }

    this.loading = true;

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
      competition: this.competition,
      // Use the original club objects from the loaded match
      club1: this.match.club1,
      club2: this.match.club2,
    };

    // Update result string if goals are provided
    if (updatedMatch.goals1 !== null && updatedMatch.goals2 !== null) {
      updatedMatch.resultatMatch = `${updatedMatch.goals1} - ${updatedMatch.goals2}`;
    }

    this.matchService.updateMatch(this.matchId, updatedMatch).subscribe({
      next: (updatedData) => {
        // Update the local match object with the returned data
        if (updatedData) {
          this.match = updatedData;
        } else {
          // Otherwise update the local object
          this.match = { ...updatedMatch };
        }
        
        this.loading = false;
        
        // Show success message
        this.successMessage = "Match updated successfully!";
        
        // Navigate back after a short delay
        setTimeout(() => {
          this.successMessage = "";
          this.router.navigate(["/superadmin/showcompetition/matches", this.competitionId]);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = "Failed to update match. Please try again.";
        this.successMessage = "";
        console.error(err);
      },
    });
  }

  cancel(): void {
    this.router.navigate(["/superadmin/showcompetition/matches", this.competitionId]);
  }
}