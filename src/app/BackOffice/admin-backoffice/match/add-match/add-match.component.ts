// import { Component } from '@angular/core';
// import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { MatchService } from '../../../../services/serviceSuperAdmin/servicegerermatch/match.service';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-add-match',
//   standalone: true,
//   imports: [ReactiveFormsModule, FormsModule,CommonModule],
//   templateUrl: './add-match.component.html',
//   styleUrls: ['./add-match.component.css']
// })
// export class AddMatchComponent {
//   matchForm: FormGroup;
//   successMessage: string = '';
//   errorMessage: string = '';
//   teams: string[] = ['Team A', 'Team B', 'Team C', 'Team D']; // Exemple de liste d'équipes

//   constructor(private matchService: MatchService, private router: Router) {
//     this.matchForm = new FormGroup({
//       resultatMatch: new FormControl('', [Validators.required]),
//       dateMatch: new FormControl('', [Validators.required]),
//       lieuMatch: new FormControl('', [Validators.required]),
//       statusMatch: new FormControl('', [Validators.required]),
//       typeMatch: new FormControl('', [Validators.required]),
//       arbitre: new FormControl('', [Validators.required]),
//       equipe1: new FormControl('', [Validators.required]),
//       equipe2: new FormControl('', [Validators.required]),
//     });
//   }

//   addMatch() {
//     if (this.matchForm.valid) {
//       this.matchService.addMatchs(this.matchForm.value).subscribe({
//         next: () => {
//           this.successMessage = 'Match ajouté avec succès !';
//           this.errorMessage = '';
//           //this.matchForm.reset();
//           //window.location.reload();
//           this.router.navigate(['/showmatch']);
//           //window.scrollTo({ top: 0, behavior: 'smooth' });
//         },
//         error: () => {
//           this.errorMessage = 'Erreur lors de l’ajout du match.';
//           this.successMessage = '';
//         }
//       });
//     }
//   }






  
//   avoidAdd() {
//     this.router.navigate(['superadmin/showmatch']); // Changez '/listsousgroup' selon votre route réelle
//   }
// }

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';  // Import NgForm here
import { MatchService } from '../../../../services/serviceSuperAdmin/servicegerermatch/match.service';
import { HttpClientModule } from '@angular/common/http';
import { ClubsService } from '../../../../services/serviceSuperAdmin/servicegererclubs/clubs.service';
import { Clubs } from '../../../../../core/models/clubs';

@Component({
  selector: 'app-add-match',
  //standalone: true,
  templateUrl: './add-match.component.html',
  styleUrls: ['./add-match.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class AddMatchComponent {




    //teams: { name: string, logo: string }[] = []; // Array to store team names and logos
    selectedFile: File | null = null;

    constructor(
      private matchService: MatchService,
      private clubsService: ClubsService // Inject ClubsService
    ) {}


  matchData = {
    resultatMatch: '',
    dateMatch: '',
    lieuMatch: '',
    statusMatch: '',
    typeMatch: '',
    arbitre: '',
    equipe1: '',
    equipe2: '',
    club1: null,
    club2: null,
  };

  //teams: string[] = ['Team A', 'Team B', 'Team C', 'Team D']; 

  


 



  teams: string[] = [];
  



  // selectedFile: File | null = null;

  // constructor(private matchService: MatchService , private clubsService : ClubsService) {}



  // ngOnInit(): void {
  //   // Fetch the clubs and set the team names
  //   this.clubsService.getAllClubs().subscribe(
  //     (clubs: Clubs[]) => {
  //       this.teams = clubs.map(club => club.nameClub); // Map club names to the teams array
  //     },
  //     (error) => {
  //       console.error('Error fetching clubs:', error);
  //     }
  //   );
  // }
  clubs : string[] = [];


  /*ngOnInit(): void {
    this.clubsService.getAllClubs().subscribe(
      (clubs: Clubs[]) => {
        this.teams = clubs.map(club => club.nameClub); // Extract only club names
      },
      error => console.error('Error fetching clubs:', error)
    );
    console.log('taaaaaaaabl'+this.teams)
  }*/


  ngOnInit(): void {
    this.getClubs()
    console.log(this.clubs)
    console.log("elista"+this.clubs)
  }


  // getClubs() {
  //   this.clubsService.getAllClubs().subscribe(
  //     (clubs) => {
  //       console.log(clubs); // This will print the fetched clubs
  //     },
  //     (error) => {
  //       console.error("Error fetching clubs:", error);
  //     }
  //   );
  // }



  getClubs(): void {
    this.clubsService.getAllClubs().subscribe(
      (clubs: Clubs[]) => {
        this.clubs = clubs.map((club) => club.nameClub); // Extract only club names
        console.log(this.clubs); // Log the names to check
      },
      (error) => {
        console.error('Error fetching clubs:', error);
      }
    );
  }


  



  // getClubs(): void {
  //   this.clubsService.getAllClubs().subscribe(data => {
  //     this.clubss = data;
  //     console.log(this.clubss);
  //   });
  // }




  







  // ngOnInit(): void {
  //   this.clubsService.getAllClubs().subscribe(
  //     (clubs: Clubs[]) => {
  //       this.teams = clubs.map(club => club.emailClub); // Extract only the names
  //     },
  //     error => console.error('Error fetching clubs:', error)
  //   ); 
  // }
  




  // Handle file input change
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }





  // Handle form submission
  onSubmit(form: NgForm) {  // Pass the whole form here
    if (form.valid && this.selectedFile) {
      // Call the service method to send the data and file to the backend
      this.matchService.createMatch(this.matchData, this.selectedFile).subscribe(
        (response) => {
          console.log('Match saved successfully', response);
        },
        (error) => {
          console.error('Error saving match', error);
        }
      );
    } else {
      console.error('Form is not valid or no file selected!');
    }
  }
}
