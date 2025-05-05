// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ClubsService } from 'src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service';

// @Component({
//   selector: 'app-update-clubs',
//   standalone: true,
//   imports: [ReactiveFormsModule, FormsModule , CommonModule],
//   templateUrl: './update-clubs.component.html',
//   styleUrls: ['./update-clubs.component.css']
// })
// export class UpdateClubsComponent implements OnInit {
//   idClub!: number;

//   // Define the initial structure of the club data.
//   clubData = {
//     nameClub: '',
//     emailClub: '',
//     adressClub: '',
//     dateClub: '',
//     licenceClub: '',
//     mediaUrl: ''
//   };

//   selectedFile!: File;

//   constructor(
//     private route: ActivatedRoute,
//     private clubService: ClubsService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     // Extract club ID from the route parameter.
//     this.idClub = Number(this.route.snapshot.paramMap.get('idClub'));
//     // Load the club data based on the ID.
//     this.loadClub();
//   }

//   // Method to fetch club data by ID
//   loadClub(): void {
//     this.clubService.getClubById(this.idClub).subscribe(data => {
//       this.clubData = {
//         nameClub: data.nameClub || '',
//         emailClub: data.emailClub || '',
//         adressClub: data.adressClub || '',
//         dateClub: data.dateClub || '',
//         licenceClub: data.licenceClub || '',
//         mediaUrl: data.mediaUrl || ''
//       };
//     });
//   }

//   // Method to handle file selection for the logo
//   onFileSelected(event: Event): void {
//     const input = event.target as HTMLInputElement;
//     if (input.files && input.files.length > 0) {
//       this.selectedFile = input.files[0];
//     }
//   }

//   // Method to handle form submission
//   // onSubmit(form: any): void {
//   //   if (form.valid) {
//   //     const formData = new FormData();
//   //     formData.append('nameClub', this.clubData.nameClub);
//   //     formData.append('emailClub', this.clubData.emailClub);
//   //     formData.append('adressClub', this.clubData.adressClub);
//   //     formData.append('dateClub', this.clubData.dateClub);
//   //     formData.append('licenceClub', this.clubData.licenceClub);
      
//   //     if (this.selectedFile) {
//   //       formData.append('logo', this.selectedFile);
//   //     }
      
//   //     this.clubService.updateClub(this.idClub, formData).subscribe({
//   //       next: () => this.router.navigate(['/superadmin/showclubs']),
//   //       error: err => console.error('Error updating club:', err)
//   //     });
      
//   //   }
//   //   console.log(this.clubData);
//   // }



//   // onSubmit(form: any): void {
//   //   if (form.valid) {
//   //     const clubData = {
//   //       nameClub: this.clubData.nameClub,
//   //       emailClub: this.clubData.emailClub,
//   //       adressClub: this.clubData.adressClub,
//   //       dateClub: this.clubData.dateClub,
//   //       licenceClub: this.clubData.licenceClub
//   //     };
  
//   //     if (this.selectedFile) {
//   //       this.clubService.updateClub(this.idClub, clubData, this.selectedFile).subscribe(

//   //         (response) => {
//   //           console.log('Club saved successfully', response);
//   //           console.log(response.idClub)
//   //           this.clubsService.uploadPostPicture(response.idClub,this.selectedFile!).subscribe({next:()=>{
  
//   //           }})
//   //         },
//   //         (error) => {
//   //           console.error('Error saving club', error);
          

//   //       //   next: () => this.router.navigate(['/superadmin/showclubs']),
//   //       //   error: err => console.error('Error updating club:', err)
//   //       // });
//   //     } else {
//   //       console.error('No file selected');
//   //     }
//   //   }
//   //   console.log(this.clubData);
//   // }




//   /*onSubmit(form: any): void {
//     if (form.valid) {
//       const clubData = {
//         nameClub: this.clubData.nameClub,
//         emailClub: this.clubData.emailClub,
//         adressClub: this.clubData.adressClub,
//         dateClub: this.clubData.dateClub,
//         licenceClub: this.clubData.licenceClub
//       };
  
//       if (this.selectedFile) {
//         this.clubService.updateClub(this.idClub, clubData, this.selectedFile).subscribe(
//           (response) => {
//             console.log('Club saved successfully', response);
//             console.log(response.idClub);
  
//             this.clubService.uploadPostPicture(response.idClub, this.selectedFile!).subscribe({
//               next: () => {
//                 console.log('Picture uploaded successfully');
//                 this.router.navigate(['/superadmin/showclubs']);
//               },
//               error: (uploadError) => {
//                 console.error('Error uploading picture', uploadError);
//               }
//             });
//           },
//           (error) => {
//             console.error('Error saving club', error);
//           }
//         );
//       } else {
//         console.error('No file selected');
//       }
//     }
//     console.log(this.clubData);
//   }*/







//     onSubmit(form: any): void {
//       if (form.valid) {
//         const clubData = {
//           nameClub: this.clubData.nameClub,
//           emailClub: this.clubData.emailClub,
//           adressClub: this.clubData.adressClub,
//           dateClub: this.clubData.dateClub,
//           licenceClub: this.clubData.licenceClub
//         };
    
//         this.clubService.updateClub(this.idClub, clubData).subscribe({
//           next: (response) => {
//             console.log('Club updated successfully', response);
            
//             if (this.selectedFile) {
//               this.clubService.uploadPostPicture(response.idClub, this.selectedFile!).subscribe({
//                 next: () => {
//                   console.log('Image uploaded successfully');
//                   this.router.navigate(['/superadmin/showclubs']);
//                 },
//                 error: (err) => console.error('Error uploading image', err)
//               });
//             } else {
//               this.router.navigate(['/superadmin/showclubs']);
//             }
//           },
//           error: (error) => console.error('Error updating club', error)
//         });
//       }
//     }
    
  

// }  



























import { CommonModule } from '@angular/common';
import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClubsService } from 'src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service';
import { Clubs } from 'src/core/models/clubs';


@Component({
  selector: 'app-update-clubs',
  templateUrl: './update-clubs.component.html',
  styleUrls: ['./update-clubs.component.css'],
    imports: [RouterModule, CommonModule,FormsModule,ReactiveFormsModule],
  
})
export class UpdateClubsComponent implements OnInit {
  clubForm!: FormGroup;
  clubId!: number;
  club!: Clubs;
  loading = false;
  loadingClub = true;
  error = '';
  successMessage = '';
  submitted = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  logoUpdated = false;
  uploadProgress = 0;
  isUploading = false;

  constructor(
    private formBuilder: FormBuilder,
    private clubsService: ClubsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.clubId = +this.route.snapshot.paramMap.get('idClub')!;
    this.loadClubDetails();
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

  loadClubDetails(): void {
    this.loadingClub = true;
    this.clubsService.getClubById(this.clubId).subscribe({
      next: (data) => {
        this.club = data;
        this.populateForm();
        this.loadingClub = false;
        
        // Set preview URL if club has a logo
        if (this.club.mediaUrl) {
          this.previewUrl = this.club.logoUrl;
        }
      },
      error: (err) => {
        this.error = 'Failed to load club details. Please try again.';
        console.error(err);
        this.loadingClub = false;
      }
    });
  }

  
  
  populateForm(): void {
    this.clubForm.patchValue({
      nameClub: this.club.nameClub,
      emailClub: this.club.emailClub,
      adressClub: this.club.adressClub,
      dateClub: this.club.dateClub, // already a string
      licenceClub: this.club.licenceClub
    });
  }
  



  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.logoUpdated = true;
      
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
    this.previewUrl = this.club.mediaUrl ? this.club.logoUrl : null;
    this.logoUpdated = false;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';
    this.successMessage = '';

    // Stop here if form is invalid
    if (this.clubForm.invalid) {
      return;
    }

    this.loading = true;

    // Update club data
    const updatedClub = new Clubs();
    updatedClub.idClub = this.clubId;
    updatedClub.nameClub = this.clubForm.get('nameClub')?.value;
    updatedClub.emailClub = this.clubForm.get('emailClub')?.value;
    updatedClub.adressClub = this.clubForm.get('adressClub')?.value;
    updatedClub.dateClub = this.clubForm.get('dateClub')?.value;
    updatedClub.licenceClub = this.clubForm.get('licenceClub')?.value;

    // First update club details
    this.clubsService.updateClub(this.clubId, updatedClub).subscribe({
      next: () => {
        // If logo is updated, upload the new logo
        if (this.logoUpdated && this.selectedFile) {
          this.uploadClubLogo();
        } else {
          this.finishUpdate();
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to update club. Please try again.';
        console.error(err);
      }
    });
  }

  uploadClubLogo(): void {
    if (!this.selectedFile) return;
    
    this.isUploading = true;
    this.uploadProgress = 0;

    this.clubsService.uploadPostPicture(this.clubId, this.selectedFile).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.isUploading = false;
          this.finishUpdate();
        }
      },
      error: (err) => {
        this.isUploading = false;
        this.loading = false;
        this.error = 'Club updated but failed to upload new logo. Please try again.';
        console.error(err);
      }
    });
  }

  finishUpdate(): void {
    this.loading = false;
    this.successMessage = 'Club updated successfully!';

    setTimeout(() => {
      this.router.navigate(['../../'], { relativeTo: this.route });
    }, 1500);
  }


  cancel(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}