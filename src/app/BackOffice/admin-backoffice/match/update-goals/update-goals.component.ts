import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService } from 'src/app/services/serviceSuperAdmin/servicegerermatch/match.service';
import { Match } from 'src/core/models/match';

@Component({
  selector: 'app-update-goals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-goals.component.html',
  styleUrls: ['./update-goals.component.css'],
})
export class UpdateGoalsComponent implements OnInit {
  goalsForm!: FormGroup;
  matchId!: number;
  match!: Match;
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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.matchId = +this.route.snapshot.paramMap.get('idMatch')!;
    this.loadMatch();
  }

  initForm(): void {
    this.goalsForm = this.formBuilder.group({
      goals1: [0, [Validators.required, Validators.min(0)]],
      goals2: [0, [Validators.required, Validators.min(0)]],
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

    // Create updated match object with result string and status
    const updatedMatch: Match = {
      ...this.match,
      goals1: goals1,
      goals2: goals2,
      resultatMatch: `${goals1} - ${goals2}`,
      // If goals are set, update status to Completed if it was Scheduled or In Progress
      statusMatch: this.shouldUpdateStatus() ? "Completed" : this.match.statusMatch
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
          this.router.navigate(['../../'], { relativeTo: this.route });
          window.location.reload();
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
    this.router.navigate(['../../'], { relativeTo: this.route });
  }

  // File selection handler with improved file handling
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.uploadedImage = input.files[0];
      
      // Create a copy of the file to avoid file locking issues
      // This creates a new File object with a different reference
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

  // Update score directly from image with improved error handling
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