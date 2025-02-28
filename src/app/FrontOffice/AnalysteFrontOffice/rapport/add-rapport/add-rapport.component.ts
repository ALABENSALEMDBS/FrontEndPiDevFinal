import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { RapportService } from 'src/app/services/serviceAnalyste/gerer-rapport/rapport.service';

@Component({
  selector: 'app-add-rapport',
  imports: [FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './add-rapport.component.html',
  styleUrls: ['./add-rapport.component.css']
})
export class AddRapportComponent {
  rapportForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private rapportService: RapportService, private rout: Router) {
    // Initialisation sans `titleSeance` et `jourSeance`
    this.rapportForm = new FormGroup({
      speedRapport: new FormControl('', [Validators.required]),
      accelerationRapport: new FormControl('', [Validators.required]),
      endurance: new FormControl('', [Validators.required]),
      muscularEndurance: new FormControl('', [Validators.required]),
      aerobicCapacity: new FormControl('', [Validators.required]),
      anaerobicCapacity: new FormControl('', [Validators.required]),
      strength: new FormControl('', [Validators.required]),
      power: new FormControl('', [Validators.required]),
      explosiveness: new FormControl('', [Validators.required]),
      verticalJump: new FormControl('', [Validators.required]),
      horizontalJump: new FormControl('', [Validators.required]),
      agility: new FormControl('', [Validators.required]),
      balance: new FormControl('', [Validators.required]),
      coordination: new FormControl('', [Validators.required]),
      reactionTime: new FormControl('', [Validators.required]),
      reactivity: new FormControl('', [Validators.required]),
      etatRapport: new FormControl('', [Validators.required]),
      blessureRapport: new FormControl('', [Validators.required]),
    });
  }

  addRapport() {
          if (this.rapportForm.valid) {
            this.rapportService.addRapport(this.rapportForm.value).subscribe({
              next: () => {
                const navigationExtras: NavigationExtras = {
                  state: { successMessage: 'Formation ajoutée avec succès !' }
                };
                this.rout.navigate(['analyste/Reportshow'], navigationExtras).then(() => {
                  window.location.reload();  // This will reload the page
                });
              },
              error: () => {
                const navigationExtras: NavigationExtras = {
                  state: { errorMessage: 'Erreur lors de l’ajout de la formation.' }
                };
                this.rout.navigate(['analyste/Reportshow'], navigationExtras).then(() => {
                  window.location.reload();  // This will reload the page
                });
              }
            });
          }
        }
}
