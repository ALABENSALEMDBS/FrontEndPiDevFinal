import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormationService } from 'src/app/services/serviceCoatch/serviceformation/formation.service';

@Component({
  selector: 'app-addformation',
  templateUrl: './addformation.component.html',
  styleUrls: ['./addformation.component.css']
})
export class AddformationComponent {
    formationForm: FormGroup;
    successMessage: string = '';
    errorMessage: string = '';

    constructor(private formationService: FormationService,private rout:Router) {
        // Initialisation manuelle du FormGroup
        this.formationForm = new FormGroup({
          nameFormation: new FormControl('', [Validators.required, Validators.minLength(3)]),
          descriptionFormation: new FormControl('', [Validators.required,])
        });
      }


      addFormation() {
        if (this.formationForm.valid) {
          this.formationService.addformation(this.formationForm.value).subscribe({
            next: () => {
              this.successMessage = 'formation ajouté avec succès !';
              this.errorMessage = '';
              this.formationForm.reset();
              window.location.reload();
            },
            error: () => {
              this.errorMessage = 'Erreur lors de l’ajout du formation.';
              this.successMessage = '';
            }
          });
        }
      }

}
