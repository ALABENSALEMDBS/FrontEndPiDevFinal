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
  sections: string[] = ["performance", "strength", "agility", "state"]
  currentSection = "performance"
  showForm: boolean = true;  // Déclare cette variable


  etatOptions = [
    "good","bad"
  ];

  blessureOptions = [
    "None","Minor","Moderate","Severe"
  ];

  constructor(private rapportService: RapportService, private rout: Router) {
    // Initialisation sans `titleSeance` et `jourSeance`
    this.rapportForm = new FormGroup({
      numeroJoueur: new FormControl('', [Validators.required]),  // Ajout du champ numeroJoueur
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
  setCurrentSection(section: string): void {
    this.currentSection = section
  }

 

  

  // Calculate progress percentage
  getProgressPercentage(): number {
    const currentIndex = this.sections.indexOf(this.currentSection)
    return ((currentIndex + 1) / this.sections.length) * 100
  }


  addRapport() {
    if (this.rapportForm.valid) {
      const numeroJoueur = this.rapportForm.value.numeroJoueur; // Récupère le numéro du joueur depuis le formulaire
  
      // Appel du service pour ajouter le rapport avec le numéro de joueur
      this.rapportService.addRapport(this.rapportForm.value, numeroJoueur).subscribe({
        next: () => {
          const navigationExtras: NavigationExtras = {
            state: { successMessage: 'Rapport ajouté avec succès !' }
          };
  
          // Cacher le formulaire après l'ajout
          this.showForm = false;
  
          // Navigation vers la page des rapports sans recharger la page
          this.rout.navigate(['analyste/Reportshow'], navigationExtras);
  
          // Attendre un court instant puis rafraîchir la page
          setTimeout(() => {
            window.location.reload();
          }, 500); // Attendre 500ms avant de recharger
        },
        error: () => {
          const navigationExtras: NavigationExtras = {
            state: { errorMessage: 'Erreur lors de l’ajout du rapport.' }
          };
  
          // Navigation vers la page des rapports sans recharger la page
          this.rout.navigate(['analyste/Reportshow'], navigationExtras);
  
          // Optionnel : Recharger la page aussi en cas d'erreur
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      });
    }
  }
  
  
  nextSection(): void {
    switch (this.currentSection) {
      case "performance":
        this.currentSection = "strength"
        break
      case "strength":
        this.currentSection = "agility"
        break
      case "agility":
        this.currentSection = "state"
        break
    }
  }

  prevSection(): void {
    switch (this.currentSection) {
      case "strength":
        this.currentSection = "performance"
        break
      case "agility":
        this.currentSection = "strength"
        break
      case "state":
        this.currentSection = "agility"
        break
    }
  }

  goToSection(section: string): void {
    this.currentSection = section
  }

  // Progress bar calculation
  

  // Status class methods
  getStatusClass(status: string): string {
    if (status === "Active") return "status-active"
    if (status === "Inactive") return "status-inactive"
    return ""
  }

  getInjuryClass(injury: string): string {
    if (injury === "None") return "injury-none"
    if (injury === "Minor") return "injury-minor"
    if (injury === "Major") return "injury-major"
    return ""
  }

  
  avoidAdd() {
    this.rout.navigate(['analyste/Reportshow']); // Navigation vers la page de rapports
  }
  
}
