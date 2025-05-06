import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ClubsService } from 'src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service';
import { Clubs } from 'src/core/models/clubs';

@Component({
  selector: 'app-add-clubs',
  templateUrl: './add-clubs.component.html',
  styleUrls: ['./add-clubs.component.css'],
  imports: [RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class AddClubsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  clubForm!: FormGroup;
  loading = false;
  error = '';
  successMessage = '';
  submitted = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  uploadProgress = 0;
  isUploading = false;

  constructor(
    private formBuilder: FormBuilder,
    private clubsService: ClubsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.clubForm = this.formBuilder.group({
      nameClub: ['', [Validators.required]],
      emailClub: ['', [Validators.required, Validators.email]],
      adressClub: ['', [Validators.required]],
      dateClub: ['', [Validators.required]],
      licenceClub: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeSelectedFile(): void {
    this.selectedFile = null;
    this.previewUrl = null;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.successMessage = '';

    // Stop here if form is invalid
    if (this.clubForm.invalid) {
      return;
    }

    // Check if a logo file is selected
    if (!this.selectedFile) {
      this.error = 'Please select a logo image for the club.';
      return;
    }

    this.loading = true;

    const club = new Clubs();
    club.nameClub = this.clubForm.get('nameClub')?.value;
    club.emailClub = this.clubForm.get('emailClub')?.value;
    club.adressClub = this.clubForm.get('adressClub')?.value;
    club.dateClub = this.clubForm.get('dateClub')?.value;
    club.licenceClub = this.clubForm.get('licenceClub')?.value;

    // Create the club with the file in a single request
    this.clubsService.createClubs(club, this.selectedFile).subscribe({
      next: (createdClub) => {
        this.loading = false;
        
        // Log the created club to see what's returned
        console.log('Created club:', createdClub);
        
        this.successMessage = 'Club created successfully with logo!';
        
        setTimeout(() => {
          this.router.navigate(['../'], { relativeTo: this.route });
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        if (err.error && err.error.message) {
          this.error = `Failed to create club: ${err.error.message}`;
        } else {
          this.error = 'Failed to create club. Please try again.';
        }
        console.error(err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}