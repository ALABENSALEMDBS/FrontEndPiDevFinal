import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CoatchService } from 'src/app/services/serviceCoatch/coatch.service';

@Component({
  selector: 'app-addsousgroup',
  templateUrl: './addsousgroup.component.html',
  styleUrls: ['./addsousgroup.component.css']
})
export class AddsousgroupComponent {
  sousGroupForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private sousGroupService: CoatchService,private rout:Router) {
    // Initialisation manuelle du FormGroup
    this.sousGroupForm = new FormGroup({
      nameSousGroup: new FormControl('', [Validators.required, Validators.minLength(3)]),
      nbrJoueurSousGroup: new FormControl('', [Validators.required, Validators.min(1), Validators.max(50)])
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
}
