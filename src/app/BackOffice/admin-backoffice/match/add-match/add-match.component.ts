

import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Clubs } from "src/core/models/clubs";
import { Match } from "src/core/models/match";
import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service";
import { ClubsService } from "src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service";

@Component({
  selector: "app-add-match",
  standalone: true,
  templateUrl: "./add-match.component.html",
  styleUrls: ["./add-match.component.css"],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddMatchComponent implements OnInit {
  matchForm!: FormGroup;
  clubs: Clubs[] = [];
  submitted = false;
  loading = false;
  error = "";

  // Match status options
  statusOptions = ["Scheduled", "Completed", "Postponed", "Cancelled"];

  // Match type options
  typeOptions = ["Friendly"];

  constructor(
    private formBuilder: FormBuilder,
    private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute,
    private clubService: ClubsService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadClubs();
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
    });
  }

  loadClubs(): void {
    this.clubService.getAllClubs().subscribe({
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
    return this.matchForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.matchForm.invalid) {
      return;
    }

    this.loading = true;

    // Get selected club IDs from the form
    const club1Id = Number(this.f["club1"].value); // Convert to number if needed
    const club2Id = Number(this.f["club2"].value); // Convert to number if needed

    // Find the selected clubs from the list using their IDs
    const club1 = this.clubs.find((club) => club.idClub === club1Id);
    const club2 = this.clubs.find((club) => club.idClub === club2Id);

    // Check if both clubs were found in the list
    if (!club1 || !club2) {
      this.error = "Please select valid clubs";
      this.loading = false;
      return;
    }

    // Create match object with the selected clubs
    const match: Match = {
      idMatch: 0,  // Will be set by the backend
      resultatMatch: "", // Initially empty
      dateMatch: this.f["dateMatch"].value,
      lieuMatch: this.f["lieuMatch"].value,
      statusMatch: this.f["statusMatch"].value,
      typeMatch: this.f["typeMatch"].value,
      arbitre: this.f["arbitre"].value,
      goals1: null,
      goals2: null,
      competition: null,
      club1: club1,  // Full club1 object
      club2: club2,  // Full club2 object
    };

    // Submit the match data
    this.matchService.createMatch(match).subscribe({
      next: () => {
        this.loading = false;
        // Reload the match data after creation
        this.loadMatches();  // Add a method to reload matches
        window.location.reload()
        this.router.navigate(["../"], { relativeTo: this.route });
      },
      error: (err) => {
        this.loading = false;
        this.error = "Check the date , the club can play only one game in 3 days.";
        console.error(err);
      },
    });
  }

  // Method to reload the match data after the match is created
  loadMatches(): void {
    this.matchService.getAllMatches().subscribe({
      next: (matches) => {
        // Assuming you have a list of matches in your component
        // You can update the match list here if needed
        console.log("Matches reloaded:", matches);
        // If you store matches in the component, you can update them here
      },
      error: (err) => {
        console.error("Failed to load matches:", err);
      },
    });
  }

  // Prevent selecting the same club for both teams
  onClub1Change(): void {
    const club1Value = this.f["club1"].value;
    const club2Value = this.f["club2"].value;

    if (club1Value && club1Value === club2Value) {
      this.f["club2"].setValue("");
    }
  }

  onClub2Change(): void {
    const club1Value = this.f["club1"].value;
    const club2Value = this.f["club2"].value;

    if (club2Value && club1Value === club2Value) {
      this.f["club1"].setValue("");
    }
  }

  cancel(): void {
    this.router.navigate(["../"], { relativeTo: this.route });
  }
}
