import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CompetitionService } from "src/app/services/serviceCompetition/competition.service";
import { ClubsService } from "src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service";
import { Clubs } from "src/core/models/clubs";

@Component({
  selector: "app-add-competition",
  standalone: true,
  templateUrl: "./add-competition.component.html",
  styleUrls: ["./add-competition.component.css"],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AddCompetitionComponent implements OnInit {
  competitionForm!: FormGroup;
  clubs: Clubs[] = [];
  selectedClubs: number[] = [];
  submitted = false;
  loading = false;
  error = "";

  // Competition type options
  competitionTypes = ["Ligue", "Coupe", "Amical"];

  constructor(
    private formBuilder: FormBuilder,
    private competitionService: CompetitionService,
    private clubsService: ClubsService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadClubs();
  }

  initForm(): void {
    this.competitionForm = this.formBuilder.group({
      nameCompetition: ["", Validators.required],
      typeC: ["", Validators.required],
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
    return this.competitionForm.controls;
  }

  onClubSelectionChange(clubId: number, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.selectedClubs.push(clubId);
    } else {
      this.selectedClubs = this.selectedClubs.filter((id) => id !== clubId);
    }
  }

  onSubmit(): void {
    this.submitted = true;
  
    // Stop here if form is invalid
    if (this.competitionForm.invalid) {
      return;
    }
  
    // Check if at least 2 clubs are selected
    if (this.selectedClubs.length < 2) {
      this.error = "Please select at least two clubs.";
      return;
    }
  
    this.loading = true;
  
    const competitionData = {
      nameCompetition: this.f["nameCompetition"].value,
      typeC: this.f["typeC"].value,
      clubIds: this.selectedClubs,
    };
  
    this.competitionService.createCompetition(competitionData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(["../"], { relativeTo: this.route });
      },
      error: (err) => {
        this.loading = false;
        this.error = "Failed to create competition. Please try again.";
        console.error(err);
        
        // Reload the page after error
        window.location.reload();
        this.cancel()
      },
    });
  }
  

  cancel(): void {
    this.router.navigate(["../"], { relativeTo: this.route });
  }
}
