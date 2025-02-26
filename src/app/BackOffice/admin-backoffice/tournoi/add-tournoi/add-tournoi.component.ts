import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TournoiService } from 'src/app/services/serviceSuperAdmin/servicegerertournoi/tournoi.service';

@Component({
  selector: 'app-add-tournoi',
  templateUrl: './add-tournoi.component.html',
  styleUrls: ['./add-tournoi.component.css']
})
export class AddTournoiComponent {

  tournoiForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';


  constructor(private tournoiService: TournoiService, private router: Router) {
    // Initialisation du FormGroup
    this.tournoiForm = new FormGroup({
      nameTournoi: new FormControl('', [Validators.required, Validators.minLength(3)]),
      debutTournoi: new FormControl('', [Validators.required]),
      finTournoi: new FormControl('', [Validators.required])
    });
  }

  addTournoi() {
    if (this.tournoiForm.valid) {
      this.tournoiService.addTournoi(this.tournoiForm.value).subscribe({
        next: () => {
          this.successMessage = 'Tournoi ajouté avec succès !';
          this.errorMessage = '';
          this.tournoiForm.reset();
          window.location.reload();
        },
        error: () => {
          this.errorMessage = 'Erreur lors de l’ajout du tournoi.';
          this.successMessage = '';
        }
      });
    }
  }

}
