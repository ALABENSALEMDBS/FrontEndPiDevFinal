import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';
import { Nouriture } from 'src/core/models/nouriture';


@Component({
  selector: 'app-update-nourriture',
  templateUrl: './update-nourriture.component.html',
  styleUrls: ['./update-nourriture.component.css'],
  standalone: false
})
export class UpdateNourritureComponent implements OnInit {
  
  nourritureForm!: FormGroup;
  successMessage = '';
  errorMessage = '';
  nourritures: Nouriture[] = [];
  oldImageUrl: string | null = null;

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
          recommandation: [nourriture.recommandation, Validators.required],
          imagesN:[nourriture.imagesN]

        });
        //this. = nourriture.imagesN;
       // this.oldImageUrl = nourriture.imagesN;
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

  imagePreview: string | null = null;
// à initialiser avec l'URL de l’image existante (depuis l'API)

onImageSelected(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;

      // Mettre à jour le champ imagesN dans le formulaire
      this.nourritureForm.patchValue({
        imagesN: this.imagePreview
      });

      // Marquer le champ comme modifié
      this.nourritureForm.get('imagesN')?.markAsDirty();
    };
    reader.readAsDataURL(file);
  }
}
}
