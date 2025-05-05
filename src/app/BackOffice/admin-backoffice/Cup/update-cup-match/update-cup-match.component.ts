// src/app/components/cup/update-cup-match/update-cup-match.component.ts
import { CommonModule } from "@angular/common"
import { Component, OnInit } from "@angular/core"
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { CupService } from "src/app/services/serviceCup/cup.service"
import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service"
import { Clubs } from "src/core/models/clubs"
import { Cup } from "src/core/models/cup"
import { Match } from "src/core/models/match"


@Component({
  selector: "app-update-cup-match",
  standalone: true,
  templateUrl: "./update-cup-match.component.html",
  styleUrls: ["./update-cup-match.component.css"],
  imports: [CommonModule, ReactiveFormsModule],
})
export class UpdateCupMatchComponent implements OnInit {
  matchForm!: FormGroup
  matchId!: number
  cupId!: number
  match!: Match
  cup!: Cup
  clubs: Clubs[] = []
  submitted = false
  loading = false
  loadingData = true
  error = ""
  successMessage = ""

  // Match status options
  statusOptions = ["Scheduled", "In Progress", "Completed", "Postponed", "Cancelled"]

  // Match type options
  typeOptions = ["Friendly", "League", "Cup", "Championship", "Playoff"]

  constructor(
    private formBuilder: FormBuilder,
    private matchService: MatchService,
    private cupService: CupService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.loadParams()
    this.loadCup()
    this.loadMatch()
  }

  loadParams(): void {
    this.cupId = +this.route.snapshot.paramMap.get("cupId")!
    this.matchId = +this.route.snapshot.paramMap.get("matchId")!
  }

  initForm(): void {
    this.matchForm = this.formBuilder.group({
      dateMatch: ["", Validators.required],
      lieuMatch: ["", Validators.required],
      statusMatch: ["", Validators.required],
      typeMatch: ["", Validators.required],
      arbitre: ["", Validators.required],
      club1: [{ value: "", disabled: true }],
      club2: [{ value: "", disabled: true }],
      goals1: [null],
      goals2: [null],
    })
  }

  loadCup(): void {
    this.cupService.getCupById(this.cupId).subscribe({
      next: (data) => {
        this.cup = data
        this.loadParticipatingClubs()
      },
      error: (err) => {
        console.error(err)
      },
    })
  }

  loadParticipatingClubs(): void {
    this.cupService.getParticipatingClubs(this.cupId).subscribe({
      next: (data) => {
        this.clubs = data
      },
      error: (err) => {
        this.error = "Failed to load participating clubs."
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
    this.error = ""
    this.successMessage = ""

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
      cup: this.cup,
      roundName: this.match.roundName,
      competition: null,
      // Use the original club objects from the loaded match
      club1: this.match.club1,
      club2: this.match.club2,
      winner: this.match.winner,
    }

    // Update result string if goals are provided
    if (updatedMatch.goals1 !== null && updatedMatch.goals2 !== null) {
      updatedMatch.resultatMatch = `${updatedMatch.goals1} - ${updatedMatch.goals2}`

      // Update winner if goals are different
      if (updatedMatch.goals1 > updatedMatch.goals2) {
        updatedMatch.winner = updatedMatch.club1
      } else if (updatedMatch.goals2 > updatedMatch.goals1) {
        updatedMatch.winner = updatedMatch.club2
      }
    }

    this.matchService.updateMatch(this.matchId, updatedMatch).subscribe({
      next: (updatedData) => {
        // Update the local match object with the returned data
        if (updatedData) {
          this.match = updatedData
        } else {
          // Otherwise update the local object
          this.match = { ...updatedMatch }
        }

        this.loading = false

        // Show success message
        this.successMessage = "Match updated successfully!"

        // Navigate back after a short delay
        setTimeout(() => {
          this.successMessage = ""
          this.router.navigate(["/superadmin/showcup/matches", this.cupId])
        }, 1500)
      },
      error: (err) => {
        this.loading = false
        this.error = "Failed to update match. Please try again."
        this.successMessage = ""
        console.error(err)
      },
    })
  }

  cancel(): void {
    this.router.navigate(["/superadmin/showcup/matches", this.cupId])
  }
}
