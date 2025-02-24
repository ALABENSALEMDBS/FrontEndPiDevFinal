import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SeanceService } from 'src/app/services/serviceCoatch/serviceSeance/seance.service';

@Component({
  selector: 'app-addseance',
  templateUrl: './addseance.component.html',
  styleUrls: ['./addseance.component.css']
})
export class AddseanceComponent {
 seanceform: FormGroup;
    successMessage: string = '';
    errorMessage: string = '';

    constructor(private seanceService: SeanceService,private rout:Router) {
        // Initialisation manuelle du FormGroup
        this.seanceform = new FormGroup({
          titleSeance: new FormControl('', [Validators.required, Validators.minLength(3)]),
          jourSeance: new FormControl('', [Validators.required,])
        });
      }


      addSeance() {
        if (this.seanceform.valid) {
          this.seanceService.addSeances(this.seanceform.value).subscribe({
            next: () => {
              this.successMessage = 'seance ajouté avec succès !';
              this.errorMessage = '';
              this.seanceform.reset();
              window.location.reload();
            },
            error: () => {
              this.errorMessage = 'Erreur lors de l’ajout du seance.';
              this.successMessage = '';
            }
          });
        }
      }

}

