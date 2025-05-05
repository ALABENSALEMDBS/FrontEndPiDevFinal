import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';
import { Nouriture } from 'src/core/models/nouriture';

@Component({
  selector: 'app-liste-nourriture',
  templateUrl: './liste-nourriture.component.html',
  styleUrls: ['./liste-nourriture.component.css'],
  standalone: false
})
export class ListeNourritureComponent {

  nourritureForm: FormGroup;
  nourritures: Nouriture[] = [];
  message: string = '';

  constructor(private fb: FormBuilder, private nouritureService: ServiceDoctorService, private router: Router ) {
    this.nourritureForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      recommandation: ['', [Validators.required, Validators.minLength(5)]],
      calories: [null, [Validators.required, Validators.min(0)]]
    });
  }
  goToCreatePage(): void {
    this.router.navigate(['doctor/createnouriture']);
  }
  ngOnInit(): void {
    this.chargerNourritures();
  }

  chargerNourritures() {
    this.nouritureService.getAllNouriture().subscribe({
      next: (data) => {
        this.nourritures = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des nourritures', err);
      }
    });
  }

  onUpdateNouritureClicked(fm: Nouriture): void {
    console.log("Bouton Edit cliqué !", fm);
    this.router.navigate(['doctor/updatenouriture'], { queryParams: { id: fm.idNourriture } });
  }

  showConfirmPopup: boolean = false;
selectedNourritureToDelete: Nouriture | null = null;

openConfirmPopup(nourriture: Nouriture): void {
  this.selectedNourritureToDelete = nourriture;
  this.showConfirmPopup = true;
}

closeConfirmPopup(): void {
  this.selectedNourritureToDelete = null;
  this.showConfirmPopup = false;
}

confirmDelete(): void {
  if (!this.selectedNourritureToDelete) return;

  this.nouritureService.deletNouriturebyid(this.selectedNourritureToDelete.idNourriture).subscribe({
    next: () => {
      this.chargerNourritures(); // Recharge la liste
      this.closeConfirmPopup();
    },
    error: (err) => {
      console.error('Erreur lors de la suppression :', err);
      this.closeConfirmPopup();
    }
  });
}}
