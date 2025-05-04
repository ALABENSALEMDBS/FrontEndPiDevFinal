// import { CommonModule } from '@angular/common';
// import { HttpClientModule } from '@angular/common/http';
// import { Component } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { ClubsService } from '../../../../services/serviceSuperAdmin/servicegererclubs/clubs.service';

// @Component({
//   selector: 'app-add-clubs',
//   imports: [CommonModule, FormsModule, HttpClientModule],
//   templateUrl: './add-clubs.component.html',
//   styleUrl: './add-clubs.component.css'
// })
// export class AddClubsComponent {

//   clubData = {
//     nameClub: '',
//     emailClub: '',
//     adressClub: '',
//     dateClub: '',
//     licenceClub: '',
//     logo: '',
//     mediaUrl:''
//   };

//   selectedFile: File | null = null; // Variable to store the selected logo file

//   constructor(private clubsService: ClubsService) {}

//   // Handle file input change
//   onFileSelected(event: any) {
//     this.selectedFile = event.target.files[0];
//   }

//   // Handle form submission
//   onSubmit(form: NgForm) {
//     if (form.valid && this.selectedFile) {
//       // Call the service method to send the data and file to the backend
//       this.clubsService.createClubs(this.clubData, this.selectedFile).subscribe(
//         (response) => {
//           console.log('Club saved successfully', response);
//           console.log(response.idClub)
//           this.clubsService.uploadPostPicture(response.idClub,this.selectedFile!).subscribe({next:()=>{

//           }})
//         },
//         (error) => {
//           console.error('Error saving club', error);
//         }
//       );
//     } else {
//       console.error('Form is not valid or no file selected!');
//     }
//   }

// }














import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ClubsService } from 'src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service';
import { Clubs } from 'src/core/models/clubs';


@Component({
  selector: 'app-add-clubs',
  templateUrl: './add-clubs.component.html',
  styleUrls: ['./add-clubs.component.css'],
      imports: [RouterModule, CommonModule,FormsModule,ReactiveFormsModule],
  
})

export class AddClubsComponent implements OnInit {
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

    // First create the club without image
    this.clubsService.createClubs(club).subscribe({
      next: (createdClub) => {
        // Then upload the image
        this.uploadClubLogo(createdClub.idClub);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to create club. Please try again.';
        console.error(err);
      }
    });
  }

  uploadClubLogo(clubId: number): void {
    if (!this.selectedFile) return;
    
    this.isUploading = true;
    this.uploadProgress = 0;

    this.clubsService.uploadPostPicture(clubId, this.selectedFile).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.isUploading = false;
          this.loading = false;
          this.successMessage = 'Club created successfully with logo!';

          setTimeout(() => {
            this.router.navigate(['../'], { relativeTo: this.route });
          }, 1500);
        }
      },
      error: (err) => {
        this.isUploading = false;
        this.loading = false;
        this.error = 'Club created but failed to upload logo. Please try again.';
        console.error(err);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}