import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';
import { Nouriture } from 'src/core/models/nouriture';


@Component({
  selector: 'app-update-nourriture',
  templateUrl: './update-nourriture.component.html',
  styleUrls: ['./update-nourriture.component.css']
})
export class UpdateNourritureComponent implements OnInit {
  
  nourritureForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  nourritures: Nouriture[] = [];

  constructor(
    private fb: FormBuilder,
    private nourritureService: ServiceDoctorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Récupérer l'ID de la nourriture depuis les paramètres de l'URL
    this.route.queryParams.subscribe(params => {
      let idNourriture = params['id']; 
      if (!idNourriture) return;

      this.getNouritureById(idNourriture);
    });

    this.loadNouritures();
  }

  // Charger toutes les nourritures
  loadNouritures(): void {
    this.nourritureService.getAllNouriture().subscribe({
      next: (data) => {
        this.nourritures = data;
        console.log("Nourritures récupérées :", this.nourritures);
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des nourritures", err);
      }
    });
  }

  // Récupérer une nourriture par ID et préremplir le formulaire
  private getNouritureById(id: number): void {
    this.nourritureService.getNouritureById(id).subscribe({
      next: (nourriture: Nouriture) => {
        this.nourritureForm = this.fb.group({
          idNourriture: [nourriture.idNourriture, [Validators.required]],
          nom: [nourriture.nom, [Validators.required]],
          calories: [nourriture.calories, [Validators.required, Validators.min(1)]],
          recommandation: [nourriture.recommandation, Validators.required]
        });

        console.log('Formulaire chargé : ', this.nourritureForm.value);
      },
      error: (err) => {
        console.error("Erreur lors de la récupération de la nourriture :", err);
      }
    });
  }

  // Mettre à jour une nourriture
  updateNourriture(): void {
    if (!this.nourritureForm || this.nourritureForm.invalid) return;

    const nourritureData: Nouriture = this.nourritureForm.value; 
    const idNourriture = nourritureData.idNourriture; 

    if (!idNourriture || isNaN(Number(idNourriture))) {
      console.error("ID de la nourriture invalide !");
      return;
    }

    console.log("Mise à jour de la nourriture ID :", idNourriture);

    this.nourritureService.updateNourritures(nourritureData).subscribe({
      next: () => {
        console.log("Nourriture mise à jour !");
        this.successMessage = "Nourriture mise à jour avec succès !";
        this.router.navigate(['doctor/listenouriture']); 
      },
      error: (err) => {
        console.error("Erreur :", err);
        this.errorMessage = "Erreur lors de la mise à jour de la nourriture.";
      }
    });
  }
}
