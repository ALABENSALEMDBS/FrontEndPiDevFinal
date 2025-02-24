import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GerercoatchService } from 'src/app/services/serviceAdminClub/serviceGererCoatch/gerercoatch.service';

@Component({
  selector: 'app-add-coach',
  templateUrl: './add-coach.component.html',
  styleUrls: ['./add-coach.component.css']
})
export class AddCoachComponent {
  coachForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private coachService: GerercoatchService, private rout: Router) {
    // Initialisation du formulaire sans idUser
    this.coachForm = new FormGroup({
      nameUsers: new FormControl('', [Validators.required, Validators.minLength(3)]),
      prenomUser: new FormControl('', [Validators.required, Validators.minLength(3)]),
      emailUser: new FormControl('', [Validators.required, Validators.email]),
      telephoneUser: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]) // 10 chiffres
    });
  }

  addCoach() {
    if (this.coachForm.valid) {
      this.coachService.addCoach(this.coachForm.value).subscribe({
        next: () => {
          this.successMessage = 'Coach ajouté avec succès !';
          this.errorMessage = '';
          this.coachForm.reset();
          this.rout.navigate(['/liste-coachs']);
        },
        error: () => {
          this.errorMessage = 'Erreur lors de l’ajout du coach.';
          this.successMessage = '';
        }
      });
    }
  }
}
