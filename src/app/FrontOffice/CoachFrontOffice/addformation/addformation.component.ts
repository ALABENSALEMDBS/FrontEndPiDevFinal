import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { FormationService } from 'src/app/services/serviceCoatch/serviceformation/formation.service';

@Component({
    selector: 'app-addformation',
    templateUrl: './addformation.component.html',
    styleUrls: ['./addformation.component.css'],
    standalone: false
})
export class AddformationComponent {
  formationOptions = ["3-3-4", "5-2-3", "4-4-2"]; // Liste des formats disponibles

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
              const navigationExtras: NavigationExtras = {
                state: { successMessage: 'Formation ajoutée avec succès !' }
              };
              this.rout.navigate(['coatch/showFormation'], navigationExtras).then(() => {
                window.location.reload();  // This will reload the page
              });
            },
            error: () => {
              const navigationExtras: NavigationExtras = {
                state: { errorMessage: 'Erreur lors de l’ajout de la formation.' }
              };
              this.rout.navigate(['coatch/showFormation'], navigationExtras).then(() => {
                window.location.reload();  // This will reload the page
              });
            }
          });
        }
      }
      

}
