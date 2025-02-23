import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoatchService } from 'src/app/services/serviceCoatch/coatch.service';

@Component({
  selector: 'app-addexercice',
  templateUrl: './addexercice.component.html',
  styleUrls: ['./addexercice.component.css']
})
export class AddexerciceComponent {
exerciceform: FormGroup;
    successMessage: string = '';
    errorMessage: string = '';

    constructor(private seanceExercice: CoatchService,private rout:Router) {
        // Initialisation manuelle du FormGroup
        this.exerciceform = new FormGroup({
          nameExercice: new FormControl('', [Validators.required, Validators.minLength(3)]),
          descriptionExercice: new FormControl('', [Validators.required,]),
          videoExercice: new FormControl('', [Validators.required,]),
          photoExercice: new FormControl('', [Validators.required,])


        });
      }


      addExercice() {
        if (this.exerciceform.valid) {
          this.seanceExercice.addExercices(this.exerciceform.value).subscribe({
            next: () => {
              this.successMessage = 'exercice ajouté avec succès !';
              this.errorMessage = '';
              this.exerciceform.reset();
              window.location.reload();
            },
            error: () => {
              this.errorMessage = 'Erreur lors de l’ajout du exercice.';
              this.successMessage = '';
            }
          });
        }
      }

}

