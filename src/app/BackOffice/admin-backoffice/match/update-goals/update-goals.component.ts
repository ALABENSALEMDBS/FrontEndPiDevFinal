import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService } from 'src/app/services/serviceSuperAdmin/servicegerermatch/match.service';
import { Match } from 'src/core/models/match';

@Component({
  selector: 'app-update-goals',
  standalone :true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-goals.component.html',
  styleUrl: './update-goals.component.css'
})
export class UpdateGoalsComponent implements OnInit {
  goalsForm!: FormGroup
  matchId!: number
  match!: Match
  submitted = false
  loading = false
  loadingData = true
  error = ""

  constructor(
    private formBuilder: FormBuilder,
    private matchService: MatchService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.initForm()

    this.matchId = +this.route.snapshot.paramMap.get("idMatch")!
    this.loadMatch()
  }

  initForm(): void {
    this.goalsForm = this.formBuilder.group({
      goals1: [0, [Validators.required, Validators.min(0)]],
      goals2: [0, [Validators.required, Validators.min(0)]],
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
    this.goalsForm.patchValue({
      goals1: this.match.goals1 || 0,
      goals2: this.match.goals2 || 0,
    })
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.goalsForm.controls
  }

  onSubmit(): void {
    this.submitted = true

    // Stop here if form is invalid
    if (this.goalsForm.invalid) {
      return
    }

    this.loading = true
    const goals1 = this.f["goals1"].value
    const goals2 = this.f["goals2"].value

    this.matchService.updateGoals(this.matchId, goals1, goals2).subscribe({
      next: () => {
        this.loading = false
        this.router.navigate(["../../"], { relativeTo: this.route })
      },
      error: (err) => {
        this.loading = false
        this.error = "Failed to update goals. Please try again."
        console.error(err)
      },
    })
  }

  cancel(): void {
    this.router.navigate(["../../"], { relativeTo: this.route })
  }
}
