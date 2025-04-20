import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';
import { ExerciceRetablissements } from 'src/core/models/ExerciceRetablissement';
import { FicheMedical } from 'src/core/models/ficheMedical';
import { Joueur } from 'src/core/models/Joueurs';

@Component({
  selector: 'app-create-update-fiche-medical',
  templateUrl: './create-update-fiche-medical.component.html',
  styleUrls: ['./create-update-fiche-medical.component.css'],
  standalone: false
})
export class CreateUpdateFicheMedicalComponent {

  ficheMedicalForm!: FormGroup;
  players: Joueur[] = [];
  exercice:ExerciceRetablissements[]=[];
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private servijoueurServiceced: ServiceDoctorService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ficheMedicalForm = this.fb.group({
      poidsFicheMedicale: ['', [Validators.required, Validators.min(1)]],
      tailleFicheMedicale: ['', [Validators.required, Validators.min(1)]],
      dateBlessure: ['', Validators.required],
      gravite: ['', Validators.required],
      type: ['', Validators.required],
      joueurId: ['', Validators.required],
      idExerciceRetablissement: [''],
    });

    this.loadPlayers();
    this.loadexercice();
  }

  loadPlayers(): void {
    this.servijoueurServiceced.getAllJoueurWithoutFiche().subscribe({
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

  addFicheMedicale(): void {
    const ficheData: FicheMedical = this.ficheMedicalForm.value; // Get form data
    const idPlayer = ficheData.joueurId; // Get player ID from form
    const idExerciceRetablissement = ficheData.idExerciceRetablissement;
    // Check if player ID is valid
    if (!idPlayer || isNaN(Number(idPlayer))) {
      console.error("ID du joueur invalide!");
      return;
    }
  
    console.log("ID du joueur :", idPlayer); // Log the player ID for debugging
    
    // Proceed with the API call if the ID is valid
    this.servijoueurServiceced.addFicheMedical(ficheData, idPlayer,idExerciceRetablissement).subscribe({
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
  }}
  
