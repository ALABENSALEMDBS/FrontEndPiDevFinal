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
  filteredClubsForTeam1: Clubs[] = []; // Filtered list for team 1
  filteredClubsForTeam2: Clubs[] = []; // Filtered list for team 2
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
        // Initialize both filtered lists
        this.filteredClubsForTeam1 = [...this.clubs];
        this.filteredClubsForTeam2 = [...this.clubs];
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
    const club1Id = Number(this.f["club1"].value);
    const club2Id = Number(this.f["club2"].value);

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
        // Navigate back after successful creation
        this.router.navigate(["../"], { relativeTo: this.route });
      },
      error: (err) => {
        this.loading = false;
        this.error = "Check the date, the club can play only one game in 3 days.";
        console.error(err);
      },
    });
  }

  // Update filtered clubs for team 1 based on team 2 selection
  updateFilteredClubsForTeam1(): void {
    const club2Id = Number(this.f?.["club2"]?.value);
    
    if (club2Id) {
      // Filter out the selected club2 from the options for club1
      this.filteredClubsForTeam1 = this.clubs.filter(club => club.idClub !== club2Id);
    } else {
      // If no club2 is selected, show all clubs for club1
      this.filteredClubsForTeam1 = [...this.clubs];
    }
  }

  // Update filtered clubs for team 2 based on team 1 selection
  updateFilteredClubsForTeam2(): void {
    const club1Id = Number(this.f?.["club1"]?.value);
    
    if (club1Id) {
      // Filter out the selected club1 from the options for club2
      this.filteredClubsForTeam2 = this.clubs.filter(club => club.idClub !== club1Id);
    } else {
      // If no club1 is selected, show all clubs for club2
      this.filteredClubsForTeam2 = [...this.clubs];
    }
  }

  // Handle club1 selection change
  onClub1Change(): void {
    const club1Id = Number(this.f["club1"].value);
    const club2Id = Number(this.f["club2"].value);
    
    // If the same club is selected for both, clear club2
    if (club1Id && club1Id === club2Id) {
      this.f["club2"].setValue("");
    }
    
    // Update filtered list for team 2
    this.updateFilteredClubsForTeam2();
  }

  // Handle club2 selection change
  onClub2Change(): void {
    const club1Id = Number(this.f["club1"].value);
    const club2Id = Number(this.f["club2"].value);
    
    // If the same club is selected for both, clear club1
    if (club2Id && club1Id === club2Id) {
      this.f["club1"].setValue("");
    }
    
    // Update filtered list for team 1
    this.updateFilteredClubsForTeam1();
  }

  cancel(): void {
    this.router.navigate(["../"], { relativeTo: this.route });
  }
}