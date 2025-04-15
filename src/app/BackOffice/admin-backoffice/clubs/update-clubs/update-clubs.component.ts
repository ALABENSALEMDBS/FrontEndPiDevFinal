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
    licenceClub: ''
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
        licenceClub: data.licenceClub || ''
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
  onSubmit(form: any): void {
    if (form.valid) {
      const formData = new FormData();
      formData.append('nameClub', this.clubData.nameClub);
      formData.append('emailClub', this.clubData.emailClub);
      formData.append('adressClub', this.clubData.adressClub);
      formData.append('dateClub', this.clubData.dateClub);
      formData.append('licenceClub', this.clubData.licenceClub);
      
      if (this.selectedFile) {
        formData.append('logo', this.selectedFile);
      }
      
      this.clubService.updateClub(this.idClub, formData).subscribe({
        next: () => this.router.navigate(['/superadmin/showclubs']),
        error: err => console.error('Error updating club:', err)
      });
      
    }
    console.log(this.clubData);
  }
}  