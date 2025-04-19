// import { CommonModule } from "@angular/common"
// import { Component, type OnInit } from "@angular/core"
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
// import { ActivatedRoute, Router } from "@angular/router"
// import { CompetitionService } from "src/app/services/serviceCompetition/competition.service"
// import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service"
// import { Competition } from "src/core/models/competition"
// import { Match } from "src/core/models/match"

// @Component({
//   selector: "app-update-competition-goals",
//   standalone: true,
//   templateUrl: "./update-competition-goals.component.html",
//   styleUrls: ["./update-competition-goals.component.css"],
//   imports: [CommonModule, ReactiveFormsModule],
// })
// export class UpdateCompetitionGoalsComponent implements OnInit {
//   goalsForm!: FormGroup
//   matchId!: number
//   competitionId!: number
//   match!: Match
//   competition: Competition | null = null
//   submitted = false
//   loading = false
//   loadingData = true
//   error = ""

//   // Properties for image upload functionality
//   uploadedImage: File | null = null
//   uploadedImagePreview: string | null = null
//   processingImage = false

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
//     this.goalsForm = this.formBuilder.group({
//       goals1: [0, [Validators.required, Validators.min(0)]],
//       goals2: [0, [Validators.required, Validators.min(0)]],
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
//     this.goalsForm.patchValue({
//       goals1: this.match.goals1 || 0,
//       goals2: this.match.goals2 || 0,
//     })
//   }

//   // Convenience getter for easy access to form fields
//   get f() {
//     return this.goalsForm.controls
//   }

//   onSubmit(): void {
//     this.submitted = true

//     // Stop here if form is invalid
//     if (this.goalsForm.invalid) {
//       return
//     }

//     this.loading = true
//     const goals1 = this.f["goals1"].value
//     const goals2 = this.f["goals2"].value

//     // Update match with new goals
//     const updatedMatch: Match = {
//       ...this.match,
//       goals1: goals1,
//       goals2: goals2,
//       // Update status to Completed if goals are set
//       statusMatch: "Completed",
//     }

//     this.matchService.updateMatch(this.matchId, updatedMatch).subscribe({
//       next: () => {
//         this.loading = false
//         this.goBack()
//       },
//       error: (err) => {
//         this.loading = false
//         this.error = "Failed to update goals. Please try again."
//         console.error(err)
//       },
//     })
//   }

//   // File selection handler
//   onFileSelected(event: Event): void {
//     const input = event.target as HTMLInputElement
//     if (input.files && input.files.length > 0) {
//       this.uploadedImage = input.files[0]

//       // Create a preview of the image
//       const reader = new FileReader()
//       reader.onload = () => {
//         this.uploadedImagePreview = reader.result as string
//       }
//       reader.readAsDataURL(this.uploadedImage)
//     }
//   }

//   // Update score directly from image
//   updateScoreFromImage(): void {
//     if (!this.uploadedImage) {
//       this.error = "No image selected."
//       return
//     }

//     this.processingImage = true
//     const formData = new FormData()
//     formData.append("file", this.uploadedImage)

//     this.matchService.updateGoalsFromSheet(this.matchId, formData).subscribe({
//       next: (updatedMatch) => {
//         this.processingImage = false
//         // Update the form with the new values
//         if (updatedMatch.goals1 !== undefined && updatedMatch.goals2 !== undefined) {
//           this.goalsForm.patchValue({
//             goals1: updatedMatch.goals1,
//             goals2: updatedMatch.goals2,
//           })
//         }
//         this.error = ""
//         // Show success message
//         alert("Score updated successfully from image!")
//       },
//       error: (err) => {
//         this.processingImage = false
//         this.error = "Failed to update score from image. Please try again or update manually."
//         console.error("Error updating score from image:", err)
//       },
//     })
//   }

//   goBack(): void {
//     this.router.navigate(["/superadmin/showcompetition/matches", this.competitionId])
//   }

//   formatDate(dateString: string): string {
//     if (!dateString) return ""
//     const date = new Date(dateString)
//     return date.toLocaleString()
//   }
// }









// import { CommonModule } from "@angular/common";
// import { Component, OnInit } from "@angular/core";
// //import { Component, OnInit } from "@angular/common";
// import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
// import { ActivatedRoute, Router } from "@angular/router";
// import { CompetitionService } from "src/app/services/serviceCompetition/competition.service";
// import { MatchService } from "src/app/services/serviceSuperAdmin/servicegerermatch/match.service";
// import { Competition } from "src/core/models/competition";
// import { Match } from "src/core/models/match";

// @Component({
//   selector: "app-update-competition-goals",
//   standalone: true,
//   templateUrl: "./update-competition-goals.component.html",
//   styleUrls: ["./update-competition-goals.component.css"],
//   imports: [CommonModule, ReactiveFormsModule],
// })
// export class UpdateCompetitionGoalsComponent implements OnInit {
//   goalsForm!: FormGroup;
//   matchId!: number;
//   competitionId!: number;
//   match!: Match;
//   competition!: Competition;
//   submitted = false;
//   loading = false;
//   loadingData = true;
//   error = "";
//   successMessage = "";

//   constructor(
//     private formBuilder: FormBuilder,
//     private matchService: MatchService,
//     private competitionService: CompetitionService,
//     private route: ActivatedRoute,
//     private router: Router,
//   ) {}

//   ngOnInit(): void {
//     this.initForm();
//     this.loadParams();
//     this.loadCompetition();
//     this.loadMatch();
//   }

//   loadParams(): void {
//     this.competitionId = +this.route.snapshot.paramMap.get("competitionId")!;
//     this.matchId = +this.route.snapshot.paramMap.get("matchId")!;
//   }

//   initForm(): void {
//     this.goalsForm = this.formBuilder.group({
//       goals1: [null, [Validators.required, Validators.min(0)]],
//       goals2: [null, [Validators.required, Validators.min(0)]],
//       statusMatch: ["Completed", Validators.required],
//     });
//   }

//   loadCompetition(): void {
//     this.competitionService.getCompetitionById(this.competitionId).subscribe({
//       next: (data) => {
//         this.competition = data;
//       },
//       error: (err) => {
//         this.error = "Failed to load competition details.";
//         console.error(err);
//       },
//     });
//   }

//   loadMatch(): void {
//     this.loadingData = true;
//     this.matchService.getMatchById(this.matchId).subscribe({
//       next: (data) => {
//         this.match = data;
//         this.populateForm();
//         this.loadingData = false;
//       },
//       error: (err) => {
//         this.error = "Failed to load match details. Please try again.";
//         console.error(err);
//         this.loadingData = false;
//       },
//     });
//   }

//   populateForm(): void {
//     this.goalsForm.patchValue({
//       goals1: this.match.goals1,
//       goals2: this.match.goals2,
//       statusMatch: this.match.statusMatch || "Completed",
//     });
//   }

//   // Convenience getter for easy access to form fields
//   get f() {
//     return this.goalsForm.controls;
//   }

//   onSubmit(): void {
//     this.submitted = true;
//     this.error = "";
//     this.successMessage = "";

//     // Stop here if form is invalid
//     if (this.goalsForm.invalid) {
//       return;
//     }

//     this.loading = true;

//     const goals1 = this.f["goals1"].value;
//     const goals2 = this.f["goals2"].value;
//     const statusMatch = this.f["statusMatch"].value;

//     // Create updated match object
//     const updatedMatch: Match = {
//       ...this.match,
//       goals1: goals1,
//       goals2: goals2,
//       resultatMatch: `${goals1} - ${goals2}`,
//       statusMatch: statusMatch,
//     };

//     this.matchService.updateMatch(this.matchId, updatedMatch).subscribe({
//       next: (updatedData) => {
//         // Update the local match object with the returned data
//         if (updatedData) {
//           this.match = updatedData;
//         } else {
//           // Otherwise update the local object
//           this.match = { ...updatedMatch };
//         }
        
//         this.loading = false;
        
//         // Show success message
//         this.successMessage = "Match goals updated successfully!";
        
//         // Navigate back after a short delay
//         setTimeout(() => {
//           this.successMessage = "";
//           this.router.navigate(["/superadmin/showcompetition/matches", this.competitionId]);
//         }, 1500);
//       },
//       error: (err) => {
//         this.loading = false;
//         this.error = "Failed to update match goals. Please try again.";
//         this.successMessage = "";
//         console.error(err);
//       },
//     });
//   }

//   cancel(): void {
//     this.router.navigate(["/superadmin/showcompetition/matches", this.competitionId]);
//   }
// }




import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompetitionService } from 'src/app/services/serviceCompetition/competition.service';
import { MatchService } from 'src/app/services/serviceSuperAdmin/servicegerermatch/match.service';
import { Competition } from 'src/core/models/competition';
import { Match } from 'src/core/models/match';

@Component({
  selector: 'app-update-competition-goals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-competition-goals.component.html',
  styleUrls: ['./update-competition-goals.component.css'],
})
export class UpdateCompetitionGoalsComponent implements OnInit {
  goalsForm!: FormGroup;
  competitionId!: number;
  matchId!: number;
  match!: Match;
  competition!: Competition;
  submitted = false;
  loading = false;
  loadingData = true;
  error = '';

  // Properties for image upload functionality
  uploadedImage: File | null = null;
  uploadedImagePreview: string | null = null;
  processingImage = false;

  constructor(
    private formBuilder: FormBuilder,
    private matchService: MatchService,
    private competitionService: CompetitionService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.competitionId = +this.route.snapshot.paramMap.get('competitionId')!;
    this.matchId = +this.route.snapshot.paramMap.get('matchId')!;
    this.loadCompetition();
    this.loadMatch();
  }

  initForm(): void {
    this.goalsForm = this.formBuilder.group({
      goals1: [0, [Validators.required, Validators.min(0)]],
      goals2: [0, [Validators.required, Validators.min(0)]],
    });
  }

  loadCompetition(): void {
    this.competitionService.getCompetitionById(this.competitionId).subscribe({
      next: (data) => {
        this.competition = data;
      },
      error: (err) => {
        this.error = 'Failed to load competition details.';
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
        this.error = 'Failed to load match details. Please try again.';
        console.error(err);
        this.loadingData = false;
      },
    });
  }

  populateForm(): void {
    this.goalsForm.patchValue({
      goals1: this.match.goals1 || 0,
      goals2: this.match.goals2 || 0,
    });
  }

  // Convenience getter for easy access to form fields
  get f() {
    return this.goalsForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.goalsForm.invalid) {
      return;
    }

    this.loading = true;
    const goals1 = this.f['goals1'].value;
    const goals2 = this.f['goals2'].value;

    // Create updated match object
    const updatedMatch: Match = {
      ...this.match,
      goals1: goals1,
      goals2: goals2,
      resultatMatch: `${goals1} - ${goals2}`,
      // If goals are set, update status to Completed if it was Scheduled or In Progress
      statusMatch: this.shouldUpdateStatus() ? "Completed" : this.match.statusMatch
    };

    this.matchService.updateMatch(this.matchId, updatedMatch).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(["/superadmin/showcompetition/matches", this.competitionId]);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to update goals. Please try again.';
        console.error(err);
      },
    });
  }

  // Helper method to determine if status should be updated to Completed
  shouldUpdateStatus(): boolean {
    const currentStatus = this.match.statusMatch?.toLowerCase();
    return currentStatus === "scheduled" || currentStatus === "in progress";
  }

  cancel(): void {
    this.router.navigate(["/superadmin/showcompetition/matches", this.competitionId]);
  }

  // File selection handler
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedImage = input.files[0];

      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadedImagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.uploadedImage);
    }
  }

  // Update score directly from image
  updateScoreFromImage(): void {
    if (!this.uploadedImage) {
      this.error = 'No image selected.';
      return;
    }

    this.processingImage = true;
    const formData = new FormData();
    formData.append('file', this.uploadedImage);

    // Log the request details for debugging
    console.log('Updating score from image for match ID:', this.matchId);
    console.log('File name:', this.uploadedImage.name);
    console.log('File size:', this.uploadedImage.size);

    this.matchService.updateGoalsFromSheet(this.matchId, formData).subscribe({
      next: (updatedMatch) => {
        this.processingImage = false;
        // Update the form with the new values
        if (updatedMatch.goals1 !== undefined && updatedMatch.goals2 !== undefined) {
          this.goalsForm.patchValue({
            goals1: updatedMatch.goals1,
            goals2: updatedMatch.goals2,
          });
        }
        this.error = '';
        // Show success message
        alert('Score updated successfully from image!');
      },
      error: (err) => {
        this.processingImage = false;
        this.error = 'Failed to update score from image. Please try again or update manually.';
        console.error('Error updating score from image:', err);
      },
    });
  }
}