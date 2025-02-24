import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JoueurService } from 'src/app/services/serviceAdminClub/serviceJoueur/joueur.service';

@Component({
  selector: 'app-update-joueur',
  templateUrl: './update-joueur.component.html',
  styleUrls: ['./update-joueur.component.css']
})
export class UpdateJoueurComponent implements OnInit {

  numeroJoueur: any;
  joueurForm!: FormGroup;
  joueurData: any = {};

  constructor(private act: ActivatedRoute, private joueurService: JoueurService, private router: Router) { }

  ngOnInit(): void {
    this.numeroJoueur = this.act.snapshot.params['numeroJoueur']; // Get the player number from route

    // Initialize the form
    this.joueurForm = new FormGroup({
      numeroJoueur: new FormControl({value: '', disabled: true}), // Player number (disabled)
      posteJoueur: new FormControl('', [Validators.required, Validators.minLength(3)]),
      debutContratJoueur: new FormControl('', Validators.required),
      finContratJoueur: new FormControl('', Validators.required),
    });

    // Load player data by numeroJoueur
  /*  this.joueurService.getbyidjoueur(this.numeroJoueur).subscribe((data) => {
      this.joueurData = data;
      this.joueurForm.patchValue(this.joueurData); // Fill form with the retrieved data
    });
  }

  // Getters for form controls (for template usage)
  get posteJoueur() {
    return this.joueurForm.get('posteJoueur');
  }

  get debutContratJoueur() {
    return this.joueurForm.get('debutContratJoueur');
  }

  get finContratJoueur() {
    return this.joueurForm.get('finContratJoueur');
  }

  // Update joueur
  updateJoueur() {
    if (this.joueurForm.valid) {
      this.joueurService.updateJoueur(this.numeroJoueur, this.joueurForm.value).subscribe(() => {
        this.joueurForm.reset();
        this.router.navigate(['/liste-joueurs']); // Redirect to list after update
      });
    }*/
  }
}
