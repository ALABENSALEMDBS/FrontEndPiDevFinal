import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SousgroupeService } from 'src/app/services/serviceCoatch/serviceSousGroupe/sousgroupe.service';

@Component({
  selector: 'app-addsousgroup',
  templateUrl: './addsousgroup.component.html',
  styleUrls: ['./addsousgroup.component.css']
})
export class AddsousgroupComponent {
  sousGroupForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private sousGroupService: SousgroupeService,private rout:Router) {
    // Initialisation manuelle du FormGroup
    this.sousGroupForm = new FormGroup({
      //nameSousGroup: new FormControl('', [Validators.required, Validators.minLength(3)]),
      //nbrJoueurSousGroup: new FormControl('', [Validators.required, Validators.min(1), Validators.max(50)])
        idSousGroup: new FormControl({ value: '', disabled: true }),
        nameSousGroup: new FormControl('', [Validators.required, Validators.minLength(3)]),
        nbrJoueurSousGroup: new FormControl('', [
          Validators.required,
          Validators.min(1),  // Le nombre doit être au moins 1
          Validators.pattern('^[1-9][0-9]*$') // Validation pour un nombre strictement positif
        ]),
      });
  }
  // cancel() {
  //   // Réinitialiser le formulaire et rediriger vers une autre page (par exemple ShowSousGroups)
  //   this.sousGroupForm.reset();
  //   this.rout.navigate(['/ShowSousGroups']);
  // }
  addSousGroup() {
    if (this.sousGroupForm.valid) {
      this.sousGroupService.addsousgroup(this.sousGroupForm.value).subscribe({
        next: () => {
          this.successMessage = 'Sous-groupe ajouté avec succès !';
          this.errorMessage = '';
          this.sousGroupForm.reset();
          window.location.reload();
        },
        error: () => {
          this.errorMessage = 'Erreur lors de l’ajout du sous-groupe.';
          this.successMessage = '';
        }
      });
    }
  }
  get nameSousGroup() {
    return this.sousGroupForm.get('nameSousGroup');
  }

  get nbrJoueurSousGroup() {
    return this.sousGroupForm.get('nbrJoueurSousGroup');
  }
}
