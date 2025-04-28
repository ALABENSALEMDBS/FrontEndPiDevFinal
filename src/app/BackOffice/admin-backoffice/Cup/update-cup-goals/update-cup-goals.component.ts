// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { CupService } from 'src/app/services/serviceCup/cup.service';
// import { Match } from 'src/core/models/match';


// @Component({
//   selector: 'app-update-cup-goals',
//   templateUrl: './update-cup-goals.component.html',
//   styleUrls: ['./update-cup-goals.component.css'],
//       imports: [CommonModule, ReactiveFormsModule ,  FormsModule],
//       standalone: true,
// })
// export class UpdateCupGoalsComponent implements OnInit {
//   goalsForm!: FormGroup;
//   cupId!: number;
//   matchId!: number;
//   match!: Match;
//   loading = false;
//   loadingMatch = true;
//   error = '';
//   successMessage = '';
//   submitted = false;

//   constructor(
//     private formBuilder: FormBuilder,
//     private cupService: CupService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.cupId = +this.route.snapshot.paramMap.get('cupId')!;
//     this.matchId = +this.route.snapshot.paramMap.get('matchId')!;
//     this.initForm();
//     this.loadMatchDetails();
//   }

//   initForm(): void {
//     this.goalsForm = this.formBuilder.group({
//       goals1: [null, [Validators.required, Validators.min(0)]],
//       goals2: [null, [Validators.required, Validators.min(0)]]
//     });
//   }

//   loadMatchDetails(): void {
//     this.loadingMatch = true;
//     // Find the match in the matches by round data
//     this.cupService.getMatchesByRound(this.cupId).subscribe({
//       next: (data) => {
//         // Find the match in the data
//         for (const round in data) {
//           const foundMatch = data[round].find(m => m.idMatch === this.matchId);
//           if (foundMatch) {
//             this.match = foundMatch;
//             this.populateForm();
//             break;
//           }
//         }
//         this.loadingMatch = false;
//       },
//       error: (err) => {
//         this.error = 'Failed to load match details. Please try again.';
//         console.error(err);
//         this.loadingMatch = false;
//       }
//     });
//   }

//   populateForm(): void {
//     this.goalsForm.patchValue({
//       goals1: this.match.goals1,
//       goals2: this.match.goals2
//     });
//   }

//   onSubmit(): void {
//     this.submitted = true;
//     this.error = '';
//     this.successMessage = '';

//     // Stop here if form is invalid
//     if (this.goalsForm.invalid) {
//       return;
//     }

//     this.loading = true;

//     const goals1 = this.goalsForm.get('goals1')?.value;
//     const goals2 = this.goalsForm.get('goals2')?.value;

//     this.cupService.updateMatchGoals(this.matchId, goals1, goals2).subscribe({
//       next: () => {
//         this.loading = false;
//         this.successMessage = 'Match goals updated successfully!';

//         setTimeout(() => {
//           this.router.navigate(['/superadmin/showcup/matches', this.cupId]);
//         }, 1500);
//       },
//       error: (err) => {
//         this.loading = false;
//         this.error = 'Failed to update match goals. Please try again.';
//         console.error(err);
//       }
//     });
//   }

//   cancel(): void {
//     this.router.navigate(['/superadmin/showcup/matches', this.cupId]);
//   }
// }















// src/app/components/cup/update-cup-goals/update-cup-goals.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CupService } from 'src/app/services/serviceCup/cup.service';
import { MatchService } from 'src/app/services/serviceSuperAdmin/servicegerermatch/match.service';
import { Cup } from 'src/core/models/cup';
import { Match } from 'src/core/models/match';

@Component({
  selector: 'app-update-cup-goals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-cup-goals.component.html',
  styleUrls: ['./update-cup-goals.component.css'],
})
export class UpdateCupGoalsComponent implements OnInit {
  goalsForm!: FormGroup;
  cupId!: number;
  matchId!: number;
  match!: Match;
  cup!: Cup;
  submitted = false;
  loading = false;
  loadingData = true;
  error = '';
  successMessage = '';

  // Properties for image upload functionality
  uploadedImage: File | null = null;
  uploadedImagePreview: string | null = null;
  processingImage = false;

  constructor(
    private formBuilder: FormBuilder,
    private matchService: MatchService,
    private cupService: CupService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cupId = +this.route.snapshot.paramMap.get('cupId')!;
    this.matchId = +this.route.snapshot.paramMap.get('matchId')!;
    this.loadCup();
    this.loadMatch();
  }

  initForm(): void {
    this.goalsForm = this.formBuilder.group({
      goals1: [0, [Validators.required, Validators.min(0)]],
      goals2: [0, [Validators.required, Validators.min(0)]],
    });
  }

  loadCup(): void {
    this.cupService.getCupById(this.cupId).subscribe({
      next: (data) => {
        this.cup = data;
      },
      error: (err) => {
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
    this.error = '';
    this.successMessage = '';

    // Stop here if form is invalid
    if (this.goalsForm.invalid) {
      return;
    }

    this.loading = true;
    const goals1 = this.f['goals1'].value;
    const goals2 = this.f['goals2'].value;

    // Determine the winner based on goals
    let winner = null;
    if (goals1 > goals2) {
      winner = this.match.club1;
    } else if (goals2 > goals1) {
      winner = this.match.club2;
    } else {
      this.error = "Cup matches cannot end in a draw. Please set a winner.";
      this.loading = false;
      return;
    }

    // Create updated match object
    const updatedMatch: Match = {
      ...this.match,
      goals1: goals1,
      goals2: goals2,
      resultatMatch: `${goals1} - ${goals2}`,
      statusMatch: "Completed",
      winner: winner
    };

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
        this.successMessage = "Match goals updated successfully!";
        
        // Navigate back after a short delay
        setTimeout(() => {
          this.successMessage = "";
          this.router.navigate(["/superadmin/showcup/matches", this.cupId]);
        }, 1500);
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
    this.router.navigate(["/superadmin/showcup/matches", this.cupId]);
  }

  // File selection handler
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedImage = input.files[0];
      
      // Create a copy of the file to avoid file locking issues
      this.uploadedImage = new File(
        [this.uploadedImage], 
        this.uploadedImage.name, 
        { type: this.uploadedImage.type }
      );

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
    this.error = '';
    this.successMessage = '';
    
    const formData = new FormData();
    
    // Add a timestamp to the file name to avoid caching issues
    const timestamp = new Date().getTime();
    const fileNameParts = this.uploadedImage.name.split('.');
    const extension = fileNameParts.pop();
    const baseName = fileNameParts.join('.');
    const newFileName = `${baseName}_${timestamp}.${extension}`;
    
    // Create a new File object with the modified name
    const modifiedFile = new File(
      [this.uploadedImage], 
      newFileName, 
      { type: this.uploadedImage.type }
    );
    
    formData.append('file', modifiedFile);

    this.matchService.updateGoalsFromSheet(this.matchId, formData).subscribe({
      next: (updatedMatch) => {
        this.processingImage = false;
        
        // Update the form with the new values
        if (updatedMatch.goals1 !== undefined && updatedMatch.goals2 !== undefined) {
          this.goalsForm.patchValue({
            goals1: updatedMatch.goals1,
            goals2: updatedMatch.goals2,
          });
          
          // Also update the match object
          this.match.goals1 = updatedMatch.goals1;
          this.match.goals2 = updatedMatch.goals2;
          this.match.resultatMatch = `${updatedMatch.goals1} - ${updatedMatch.goals2}`;
          
          // Determine winner
          if (updatedMatch.goals1 != null && updatedMatch.goals2 != null) {
            if (updatedMatch.goals1 > updatedMatch.goals2) {
              this.match.winner = this.match.club1;
            } else if (updatedMatch.goals2 > updatedMatch.goals1) {
              this.match.winner = this.match.club2;
            } else {
              this.match.winner = null; // Match nul ou égalité
            }
          } else {
            this.match.winner = null; // Les scores ne sont pas encore définis
          }
          
          
          if (this.shouldUpdateStatus()) {
            this.match.statusMatch = "Completed";
          }
        }
        
        this.successMessage = 'Score updated successfully from image!';
        
        // Clear the file input after successful processing
        this.uploadedImage = null;
        this.uploadedImagePreview = null;
        
        // Reset the file input element
        const fileInput = document.getElementById('scoreImage') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      },
      error: (err) => {
        this.processingImage = false;
        this.error = 'Failed to update score from image. Please try again or update manually.';
        console.error('Error updating score from image:', err);
      },
    });
  }
}