import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';
import { ExerciceRetablissements } from 'src/core/models/ExerciceRetablissement';
import { FicheMedical } from 'src/core/models/ficheMedical';
import { Joueur } from 'src/core/models/Joueurs';

@Component({
  selector: 'app-update-fiche-medicale',
  templateUrl: './update-fiche-medicale.component.html',
  styleUrls: ['./update-fiche-medicale.component.css'],
  standalone: false
})
export class UpdateFicheMedicaleComponent {

  ficheMedicalForm?: FormGroup;
  players: Joueur[] = [];
  exercice:ExerciceRetablissements[]=[];
  
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private servijoueurServiceced: ServiceDoctorService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      let ficheId = params['id']; // Read the query parameter
      
      if(!ficheId) return;

      this.getFicheById(ficheId);
    });

    this.loadPlayers();
    this.loadexercice();
  }

  loadPlayers(): void {
    this.servijoueurServiceced.getalljoueur().subscribe({
      next: (data) => {
        this.players = data;
        console.log("Joueurs récupérés :", this.players);
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des joueurs", err);
      }
    });
  }

  loadexercice(): void {
    this.servijoueurServiceced.getAllExercices().subscribe({
      next: (data) => {
        this.exercice = data;
        console.log("Joueurs récupérés :", this.exercice);
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des joueurs", err);
      }
    });
  }

  private getFicheById(id: number): void {
    this.servijoueurServiceced.getFicheMedicaleById(id).subscribe(
      {
        next: (value: FicheMedical) => {

          this.ficheMedicalForm = this.fb.group({
            idFicheMedicale: [value.idFicheMedicale, [Validators.required]],
            poidsFicheMedicale: [value.poidsFicheMedicale, [Validators.required, Validators.min(1)]],
            tailleFicheMedicale: [value.tailleFicheMedicale, [Validators.required, Validators.min(1)]],
            dateBlessure: [value.dateBlessure, Validators.required],
            gravite: [value.gravite, Validators.required],
            type: [value.type, Validators.required],
            joueurId:[ { value: value.joueurId, disabled: true} , Validators.required],
            idExerciceRetablissement: [value.idExerciceRetablissement, Validators.required] // Make sure this is included
            
          });

          console.log('ff : ', this.ficheMedicalForm)
        }
      }
    )
  }

  // addFicheMedicale(): void {
  //   if (this.ficheMedicalForm.valid) {
  //     const ficheMedical: FicheMedical = this.ficheMedicalForm.value;
  //     this.servijoueurServiceced.addFicheMedical(ficheMedical, ficheMedical.joueurId).subscribe(
  //       (response) => {
  //         this.successMessage = 'Fiche médicale ajoutée avec succès !';
  //         this.errorMessage = '';
  //         this.ficheMedicalForm.reset();
  //         setTimeout(() => this.router.navigate(['/ShowFicheMedicales']), 2000);
  //       },
  //       (error) => {
  //         this.errorMessage = "Erreur lors de l'ajout de la fiche médicale.";
  //         this.successMessage = '';
  //         console.error(error);
  //       }
  //);
  //}
  //}
  updateFicheMedicale(): void {
    if(!this.ficheMedicalForm) return;

    const ficheData: FicheMedical = this.ficheMedicalForm.getRawValue(); // Get form data
    const idPlayer = ficheData.joueurId; // Get player ID from form
    const idExercice = ficheData.idExerciceRetablissement;

    // Check if player ID is valid
    if (!idPlayer || isNaN(Number(idPlayer))) {
      console.error("ID du joueur invalide!");
      return;
    }
    if (!idExercice || isNaN(Number(idExercice))) {
      console.error("ID de l'exercice invalide!");
      return;
    }

    console.log("ID du joueur :", idPlayer); // Log the player ID for debugging
    console.log("ID de l'exercice :", idExercice);

    // Proceed with the API call if the ID is valid
    this.servijoueurServiceced.updateFicheMedical(ficheData,idExercice).subscribe({
      next: () => {
        console.log("Fiche médicale ajoutée !");
        this.successMessage = "Fiche médicale ajoutée avec succès !";
        this.router.navigate(['doctor/listefiche'])
      },
      error: (err) => {
        console.error("Erreur :", err);
        this.errorMessage = "Erreur lors de l'ajout de la fiche médicale.";
        
      }
    });
  }

}
