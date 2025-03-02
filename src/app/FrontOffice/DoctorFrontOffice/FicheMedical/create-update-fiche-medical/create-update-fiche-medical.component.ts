import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';
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
      joueurId: ['', Validators.required]
    });

    this.loadPlayers();
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
  addFicheMedicale(): void {
    const ficheData: FicheMedical = this.ficheMedicalForm.value; // Get form data
    const idPlayer = ficheData.joueurId; // Get player ID from form
  
    // Check if player ID is valid
    if (!idPlayer || isNaN(Number(idPlayer))) {
      console.error("ID du joueur invalide!");
      return;
    }
  
    console.log("ID du joueur :", idPlayer); // Log the player ID for debugging
    
    // Proceed with the API call if the ID is valid
    this.servijoueurServiceced.addFicheMedical(ficheData, idPlayer).subscribe({
      next: () => { 
        console.log("Fiche médicale ajoutée !");
        this.successMessage = "Fiche médicale ajoutée avec succès !";
      },
      error: (err) => { 
        console.error("Erreur :", err);
        this.errorMessage = "Erreur lors de l'ajout de la fiche médicale.";
      }
    });
  }}
  
