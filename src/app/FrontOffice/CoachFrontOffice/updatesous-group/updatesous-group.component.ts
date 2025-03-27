import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SousgroupeService } from 'src/app/services/serviceCoatch/serviceSousGroupe/sousgroupe.service';

@Component({
    selector: 'app-updatesous-group',
    templateUrl: './updatesous-group.component.html',
    styleUrls: ['./updatesous-group.component.css'],
    standalone: false
})
export class UpdatesousGroupComponent implements OnInit {

  idSousGroup: any;
  sousGroupForm!: FormGroup;
  listSousGroup: any[] = [];
  isModalOpen = true;

  constructor(private act: ActivatedRoute, private sousGrpService: SousgroupeService, private router: Router) { }

  ngOnInit(): void {
    this.idSousGroup = this.act.snapshot.params['idSousGroup']; // Récupérer l'ID du sous-groupe

    // Initialisation du formulaire
    this.sousGroupForm = new FormGroup({
      idSousGroup: new FormControl({value: '', disabled: true}), // Ajout champ idSousGroup
      nameSousGroup: new FormControl('', [Validators.required, Validators.minLength(3)]),
      nbrJoueurSousGroup: new FormControl('', [Validators.required, Validators.min(1), Validators.max(50)]),
    });

    // Charger les données du sous-groupe à modifier
    this.sousGrpService.getbyidsousgroup(this.idSousGroup).subscribe((data) => {
      console.log("Données récupérées :", data);
      this.listSousGroup = [data];  // On met les données récupérées dans le tableau
      this.sousGroupForm.patchValue(this.listSousGroup[0]);  // Remplir le formulaire avec les données récupérées

    });
  }

  get nameSousGroup() {
    return this.sousGroupForm.get('nameSousGroup');
  }

  get nbrJoueurSousGroup() {
    return this.sousGroupForm.get('nbrJoueurSousGroup');
  }

  // updateSousGroup() {
  //   if (this.sousGroupForm.valid) {
  //     this.sousGrpService.updatesousgroup( this.idSousGroup,this.sousGroupForm.value).subscribe(() => {
  //       this.sousGroupForm.reset();
  //       this.closeModal();

  //       this.router.navigate(['/coatch/ShowSousGroups']).then(() => {
  //         window.location.reload();  // This will reload the page after navigation
  //       });
  //       this.router.navigate(['/coatch/ShowSousGroups']).then(() => {
  //         console.log("Navigation réussie !");
  //       }).catch(err => console.error("Erreur de navigation :", err));
  //     });
  //   }
  // }
  // goToShowSousGroups() {
  //   this.router.navigate(['/coatch/ShowSousGroups']);
  // }


  updateSousGroup() {
    if (this.sousGroupForm.valid) {
      this.sousGrpService.updatesousgroup(this.idSousGroup, this.sousGroupForm.value).subscribe(() => {
        this.sousGroupForm.reset();
        this.closeModal();  // Ferme la modale avant de naviguer

        // Navigation vers la page des sous-groupes après la mise à jour
        setTimeout(() => {
          this.router.navigateByUrl('/coatch/ShowSousGroups');
          window.location.reload();  // Recharger la page pour voir les mises à jour

        }, 200);  // Délai de 200ms pour s'assurer que la mise à jour est terminée
      });
    }
  }

  goToShowSousGroups() {
    this.router.navigate(['/coatch/ShowSousGroups']);  // Redirige vers la page des sous-groupes
    this.closeModal();  // Ferme la modale si elle est ouverte
  }

   closeModal() {
     this.isModalOpen = false;
     if (!this.sousGroupForm.dirty) {
      this.router.navigate(['/coatch/ShowSousGroups']);
    }
   }


}
