import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { SousgroupeService } from 'src/app/services/serviceCoatch/serviceSousGroupe/sousgroupe.service';
import { Joueurs } from 'src/core/models/joueur';
import { sousgroup } from 'src/core/models/sousgroup';

@Component({
    selector: 'app-addsousgroup',
    templateUrl: './addsousgroup.component.html',
    styleUrls: ['./addsousgroup.component.css'],
    standalone: false
})
export class AddsousgroupComponent implements OnInit{
  sg: sousgroup = new sousgroup();
  sousGroupForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  playersArray: number[] = [];
  filteredItems: string[] = [];
  players: string[] = [];
  playersObject: Joueurs[] = [];
  filteredPlayersObject: Joueurs[] = [];
  //filteredPlayers: string[] = [];
  filteredPlayers: string[][] = [];


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
  ngOnInit(): void {
    //this.filteredPlayers = [...this.players];
    this.getAllPlayers();
  }

  get joueursArray(): FormArray {
    return this.sousGroupForm.get('joueurs') as FormArray;
  }

  getAllPlayers(): void {
    this.sousGroupService.getalljoueur().subscribe(data => {

      data.forEach(item =>{
        this.players.push(item.nameUsers)
        this.playersObject.push(item)
      });
    });
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


  // filterPlayers(filterValue: string): void {
  //   this.filteredPlayers = this.players.filter(player =>
  //     player.toLowerCase().startsWith(filterValue.toLowerCase())
  //   );
  // }

  filterPlayers(filterValue: string, index: number): void {
    this.filteredPlayers[index] = this.players.filter(player =>
      player.toLowerCase().startsWith(filterValue.toLowerCase())
    );
  }

  selectPlayer(playerName: string, index: number): void {
    this.sousGroupForm.get(`playerName${index}`)?.setValue(playerName);
    this.filteredPlayers[index] = []; // Cache la liste après sélection
    for (var j of this.playersObject) {
      if(j.nameUsers == playerName){
        this.filteredPlayersObject.push(j)
      }
    }
  }


  updatePlayerFields(nbrJoueur: number) {
    this.playersArray = Array.from({ length: nbrJoueur }, (_, i) => i);
    this.playersArray.forEach(i => {
      this.sousGroupForm.addControl(`playerName${i}`, new FormControl('', Validators.required));
    });
  }
  // cancel() {
  //   // Réinitialiser le formulaire et rediriger vers une autre page (par exemple ShowSousGroups)
  //   this.sousGroupForm.reset();
  //   this.rout.navigate(['/ShowSousGroups']);
  // }

  addSousGroup() {
    if (this.sousGroupForm.valid) {
      this.isLoading = true;
      this.sg!.nameSousGroup=this.sousGroupForm.controls['nameSousGroup'].value;
      this.sg!.nbrJoueurSousGroup=this.sousGroupForm.controls['nbrJoueurSousGroup'].value;
      this.sg!.joueurs=this.filteredPlayersObject;
      this.sousGroupService.addsousgroup(this.sg).subscribe({
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
        },
        complete: () => {
          this.isLoading = false; 
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

  public isLoading = false;


}
