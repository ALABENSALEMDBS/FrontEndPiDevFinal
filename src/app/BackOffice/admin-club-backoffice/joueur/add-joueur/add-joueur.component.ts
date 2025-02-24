import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JoueurService } from 'src/app/services/serviceAdminClub/serviceJoueur/joueur.service';

@Component({
  selector: 'app-add-joueur',
  templateUrl: './add-joueur.component.html',
  styleUrls: ['./add-joueur.component.css']
})
export class AddJoueurComponent {
    joueurForm: FormGroup;
    successMessage: string = '';
    errorMessage: string = '';

      constructor(private joueurService: JoueurService,private rout:Router) {
        // Initialisation manuelle du FormGroup
        this.joueurForm = new FormGroup({
          posteJoueur: new FormControl('', [Validators.required, Validators.minLength(3)]),
          numeroJoueur: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]), // Only digits
          debutContratJoueur: new FormControl('', Validators.required),
          finContratJoueur: new FormControl('', Validators.required)        });
      }


      addJoueur() {
        if (this.joueurForm.valid) {
          this.joueurService.addJoueur(this.joueurForm.value).subscribe({
            next: () => {
              this.successMessage = 'joueur ajouté avec succès !';
              this.errorMessage = '';
              this.joueurForm.reset();
              window.location.reload();
            },
            error: () => {
              this.errorMessage = 'Erreur lors de l’ajout de joueur.';
              this.successMessage = '';
            }
          });
        }
      }

}
