import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClubsService } from 'src/app/services/serviceSuperAdmin/servicegererclubs/clubs.service';

@Component({
  selector: 'app-update-clubs',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule , CommonModule],
  templateUrl: './update-clubs.component.html',
  styleUrls: ['./update-clubs.component.css']
})
export class UpdateClubsComponent implements OnInit {
  idClub!: number;

  // Define the initial structure of the club data.
  clubData = {
    nameClub: '',
    emailClub: '',
    adressClub: '',
    dateClub: '',
    licenceClub: '',
    mediaUrl: ''
  };

  selectedFile!: File;

  constructor(
    private route: ActivatedRoute,
    private clubService: ClubsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Extract club ID from the route parameter.
    this.idClub = Number(this.route.snapshot.paramMap.get('idClub'));
    // Load the club data based on the ID.
    this.loadClub();
  }

  // Method to fetch club data by ID
  loadClub(): void {
    this.clubService.getClubById(this.idClub).subscribe(data => {
      this.clubData = {
        nameClub: data.nameClub || '',
        emailClub: data.emailClub || '',
        adressClub: data.adressClub || '',
        dateClub: data.dateClub || '',
        licenceClub: data.licenceClub || '',
        mediaUrl: data.mediaUrl || ''
      };
    });
  }

  // Method to handle file selection for the logo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  // Method to handle form submission
  // onSubmit(form: any): void {
  //   if (form.valid) {
  //     const formData = new FormData();
  //     formData.append('nameClub', this.clubData.nameClub);
  //     formData.append('emailClub', this.clubData.emailClub);
  //     formData.append('adressClub', this.clubData.adressClub);
  //     formData.append('dateClub', this.clubData.dateClub);
  //     formData.append('licenceClub', this.clubData.licenceClub);
      
  //     if (this.selectedFile) {
  //       formData.append('logo', this.selectedFile);
  //     }
      
  //     this.clubService.updateClub(this.idClub, formData).subscribe({
  //       next: () => this.router.navigate(['/superadmin/showclubs']),
  //       error: err => console.error('Error updating club:', err)
  //     });
      
  //   }
  //   console.log(this.clubData);
  // }



  // onSubmit(form: any): void {
  //   if (form.valid) {
  //     const clubData = {
  //       nameClub: this.clubData.nameClub,
  //       emailClub: this.clubData.emailClub,
  //       adressClub: this.clubData.adressClub,
  //       dateClub: this.clubData.dateClub,
  //       licenceClub: this.clubData.licenceClub
  //     };
  
  //     if (this.selectedFile) {
  //       this.clubService.updateClub(this.idClub, clubData, this.selectedFile).subscribe(

  //         (response) => {
  //           console.log('Club saved successfully', response);
  //           console.log(response.idClub)
  //           this.clubsService.uploadPostPicture(response.idClub,this.selectedFile!).subscribe({next:()=>{
  
  //           }})
  //         },
  //         (error) => {
  //           console.error('Error saving club', error);
          

  //       //   next: () => this.router.navigate(['/superadmin/showclubs']),
  //       //   error: err => console.error('Error updating club:', err)
  //       // });
  //     } else {
  //       console.error('No file selected');
  //     }
  //   }
  //   console.log(this.clubData);
  // }




  /*onSubmit(form: any): void {
    if (form.valid) {
      const clubData = {
        nameClub: this.clubData.nameClub,
        emailClub: this.clubData.emailClub,
        adressClub: this.clubData.adressClub,
        dateClub: this.clubData.dateClub,
        licenceClub: this.clubData.licenceClub
      };
  
      if (this.selectedFile) {
        this.clubService.updateClub(this.idClub, clubData, this.selectedFile).subscribe(
          (response) => {
            console.log('Club saved successfully', response);
            console.log(response.idClub);
  
            this.clubService.uploadPostPicture(response.idClub, this.selectedFile!).subscribe({
              next: () => {
                console.log('Picture uploaded successfully');
                this.router.navigate(['/superadmin/showclubs']);
              },
              error: (uploadError) => {
                console.error('Error uploading picture', uploadError);
              }
            });
          },
          (error) => {
            console.error('Error saving club', error);
          }
        );
      } else {
        console.error('No file selected');
      }
    }
    console.log(this.clubData);
  }*/







    onSubmit(form: any): void {
      if (form.valid) {
        const clubData = {
          nameClub: this.clubData.nameClub,
          emailClub: this.clubData.emailClub,
          adressClub: this.clubData.adressClub,
          dateClub: this.clubData.dateClub,
          licenceClub: this.clubData.licenceClub
        };
    
        this.clubService.updateClub(this.idClub, clubData).subscribe({
          next: (response) => {
            console.log('Club updated successfully', response);
            
            if (this.selectedFile) {
              this.clubService.uploadPostPicture(response.idClub, this.selectedFile!).subscribe({
                next: () => {
                  console.log('Image uploaded successfully');
                  this.router.navigate(['/superadmin/showclubs']);
                },
                error: (err) => console.error('Error uploading image', err)
              });
            } else {
              this.router.navigate(['/superadmin/showclubs']);
            }
          },
          error: (error) => console.error('Error updating club', error)
        });
      }
    }
    
  

}  