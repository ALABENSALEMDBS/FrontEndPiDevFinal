import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { SousgroupeService } from 'src/app/services/serviceCoatch/serviceSousGroupe/sousgroupe.service';

@Component({
    selector: 'app-addsousgroup',
    templateUrl: './addsousgroup.component.html',
    styleUrls: ['./addsousgroup.component.css'],
    standalone: false
})
export class AddsousgroupComponent {
  sousGroupForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  playersArray: number[] = [];

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
      this.sousGroupForm.get('nbrJoueurSousGroup')?.valueChanges.subscribe(value => {
        this.updatePlayerFields(value);
      });
      joueurs: new FormArray([]) // Tableau dynamique des joueurs
  }

  get joueursArray(): FormArray {
    return this.sousGroupForm.get('joueurs') as FormArray;
  }


  onNbrJoueurChange(): void {
    const nbrJoueur = this.sousGroupForm.get('nbrJoueurSousGroup')?.value || 0;
    this.updateJoueursArray(nbrJoueur);
  }

    updateJoueursArray(nbrJoueur: number): void {
    const joueursArray = this.joueursArray;
    joueursArray.clear(); // Supprimer les anciens champs

    for (let i = 0; i < nbrJoueur; i++) {
      joueursArray.push(new FormGroup({
        name: new FormControl('', Validators.required),
        prenom: new FormControl('', Validators.required)
      }));
    }
  }

  updatePlayerFields(nbrJoueur: number) {
    this.playersArray = Array.from({ length: nbrJoueur }, (_, i) => i);
    this.playersArray.forEach(i => {
      this.sousGroupForm.addControl(`playerFirstName${i}`, new FormControl('', Validators.required));
      this.sousGroupForm.addControl(`playerLastName${i}`, new FormControl('', Validators.required));
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
          const navigationExtras: NavigationExtras = {
            state: { successMessage: 'Sub-group added successfully!' }
          };
          this.rout.navigate(['/coatch/ShowSousGroups'], navigationExtras).then(() => {
            window.location.reload();  // This will reload the page
          });
        },
        error: () => {
          const navigationExtras: NavigationExtras = {
            state: { errorMessage: 'Error adding the subgroup.' }
          };
          this.rout.navigate(['/coatch/ShowSousGroups'], navigationExtras).then(() => {
            window.location.reload();  // This will reload the page
          });
        }
      });
    }
  }


        // addSousGroup() {
        //   if (this.sousGroupForm.valid) {
        //     this.sousGroupService.addsousgroup(this.sousGroupForm.value).subscribe({
        //       next: () => {
        //         this.successMessage = 'Sous-groupe ajouté avec succès !';
        //         this.errorMessage = '';
        //         this.sousGroupForm.reset();
        //         window.location.reload();
        //       },
        //       error: () => {
        //         this.errorMessage = 'Erreur lors de l’ajout du sous-groupe.';
        //         this.successMessage = '';
        //       }
        //     });
        //   }
        // }




  get nameSousGroup() {
    return this.sousGroupForm.get('nameSousGroup');
  }

  get nbrJoueurSousGroup() {
    return this.sousGroupForm.get('nbrJoueurSousGroup');
  }

  avoidAdd() {
    this.rout.navigate(['/coatch/ShowSousGroups']); // Changez '/listsousgroup' selon votre route réelle
  }
}
