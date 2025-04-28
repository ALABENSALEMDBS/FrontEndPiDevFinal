import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ClubsService } from '../../../../services/serviceSuperAdmin/servicegererclubs/clubs.service';

@Component({
  selector: 'app-add-clubs',
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './add-clubs.component.html',
  styleUrl: './add-clubs.component.css'
})
export class AddClubsComponent {

  clubData = {
    nameClub: '',
    emailClub: '',
    adressClub: '',
    dateClub: '',
    licenceClub: '',
    logo: '',
    mediaUrl:''
  };

  selectedFile: File | null = null; // Variable to store the selected logo file

  constructor(private clubsService: ClubsService) {}

  // Handle file input change
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Handle form submission
  onSubmit(form: NgForm) {
    if (form.valid && this.selectedFile) {
      // Call the service method to send the data and file to the backend
      this.clubsService.createClubs(this.clubData, this.selectedFile).subscribe(
        (response) => {
          console.log('Club saved successfully', response);
          console.log(response.idClub)
          this.clubsService.uploadPostPicture(response.idClub,this.selectedFile!).subscribe({next:()=>{

          }})
        },
        (error) => {
          console.error('Error saving club', error);
        }
      );
    } else {
      console.error('Form is not valid or no file selected!');
    }
  }

}
