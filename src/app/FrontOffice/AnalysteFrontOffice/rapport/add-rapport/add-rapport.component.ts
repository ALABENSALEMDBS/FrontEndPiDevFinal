import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RapportService } from 'src/app/services/serviceAnalyste/gerer-rapport/rapport.service';

// Import models
import { Joueurs } from 'src/core/models/joueur';
import { sousgroup } from 'src/core/models/sousgroup';
import { seance } from 'src/core/models/seance';
import { Rapport } from 'src/core/models/rapport';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-rapport',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-rapport.component.html',
  styleUrls: ['./add-rapport.component.css']
})
export class AddRapportComponent implements OnInit {
  rapportForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  sections: string[] = ["player", "performance", "strength", "agility", "state"];
  currentSection = "player";
  showForm: boolean = true;

  // Lists for dropdowns
  joueurs: Joueurs[] = [];
  sousGroupes: sousgroup[] = [];
  seances: seance[] = [];
  filteredSousGroupes: sousgroup[] = [];
  filteredJoueurs: Joueurs[] = [];
  
  // Variable to store selected player
  selectedJoueur: Joueurs | null = null;

  etatOptions = [
    "GOOD", "BAD"
  ];

  blessureOptions = [
    "None", "Minor", "Moderate", "Severe"
  ];

  constructor(
    private fb: FormBuilder,
    private rapportService: RapportService, 
    private router: Router
  ) {
    this.rapportForm = this.fb.group({
      numeroJoueur: ['', Validators.required],
      nameSousGroup: ['', Validators.required],
      titleSeance: ['', Validators.required],
      speedRapport: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      accelerationRapport: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      endurance: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      muscularEndurance: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      aerobicCapacity: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      anaerobicCapacity: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      strength: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      power: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      explosiveness: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      verticalJump: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      horizontalJump: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      agility: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      balance: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      coordination: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      reactionTime: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      reactivity: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      etatRapport: ['', Validators.required],
      // Date is set automatically in the addRapport method
    });

    // Add value change listeners for cascading dropdowns
    this.rapportForm.get('titleSeance')?.valueChanges.subscribe(titleSeance => {
      if (titleSeance) {
        this.loadSousGroupesBySession(titleSeance);
        // Reset sub-group and player selections when session changes
        this.rapportForm.get('nameSousGroup')?.setValue('');
        this.rapportForm.get('numeroJoueur')?.setValue('');
        this.filteredJoueurs = [];
        this.selectedJoueur = null;
      }
    });

    this.rapportForm.get('nameSousGroup')?.valueChanges.subscribe(nameSousGroup => {
      if (nameSousGroup) {
        this.loadJoueursBySousGroup(nameSousGroup);
        // Reset player selection when sub-group changes
        this.rapportForm.get('numeroJoueur')?.setValue('');
        this.selectedJoueur = null;
      }
    });
    
    // Add listener for player change
    this.rapportForm.get('numeroJoueur')?.valueChanges.subscribe(numeroJoueur => {
      if (numeroJoueur) {
        this.updateSelectedJoueur(numeroJoueur);
      } else {
        this.selectedJoueur = null;
      }
    });
  }

  ngOnInit(): void {
    // Load initial data for session dropdown
    this.loadSeances();
  }

  // Methods to load data for dropdowns
  loadJoueurs(): void {
    this.rapportService.getAllJoueurs().subscribe({
      next: (data) => {
        this.joueurs = data;
      },
      error: (err) => {
        console.error('Error loading joueurs:', err);
      }
    });
  }

  loadSousGroupes(): void {
    this.rapportService.getAllSousGroupes().subscribe({
      next: (data) => {
        this.sousGroupes = data;
      },
      error: (err) => {
        console.error('Error loading sous groupes:', err);
      }
    });
  }

  loadSeances(): void {
    this.rapportService.getAllSeances().subscribe({
      next: (data) => {
        this.seances = data;
      },
      error: (err) => {
        console.error('Error loading seances:', err);
      }
    });
  }

  // Methods for cascading dropdowns
  loadSousGroupesBySession(titleSeance: string): void {
    this.rapportService.findSousGroupestitleSeance(titleSeance).subscribe({
      next: (data: any) => {
        this.filteredSousGroupes = data;
      },
      error: (err) => {
        console.error('Error loading sous groupes by session:', err);
        this.filteredSousGroupes = [];
      }
    });
  }

  loadJoueursBySousGroup(nameSousGroup: string): void {
    this.rapportService.findJoueursBynameSousGroup(nameSousGroup).subscribe({
      next: (data: any) => {
        this.filteredJoueurs = data;
      },
      error: (err) => {
        console.error('Error loading joueurs by sous groupe:', err);
        this.filteredJoueurs = [];
      }
    });
  }
  
  // Method to update selected player
  updateSelectedJoueur(numeroJoueur: any): void {
    const formValue = Number(numeroJoueur);
    this.selectedJoueur = this.filteredJoueurs.find(j => Number(j.numeroJoueur) === formValue) || null;
  }
  
  // Get player photo
  getPlayerPhoto(): string {
    if (this.selectedJoueur && this.selectedJoueur.photoUser) {
      return this.selectedJoueur.photoUser;
    }
    // Return default image if no photo
    return 'assets/images/default-player.png';
  }
  
  // Check if player has a photo
  hasPlayerPhoto(): boolean {
    return !!(this.selectedJoueur && this.selectedJoueur.photoUser);
  }

  // Calculate progress percentage
  getProgressPercentage(): number {
    const currentIndex = this.sections.indexOf(this.currentSection);
    return ((currentIndex + 1) / this.sections.length) * 100;
  }
  addRapport() {
    if (this.rapportForm.valid) {
      const numeroJoueur = this.rapportForm.value.numeroJoueur;
      const nameSousGroup = this.rapportForm.value.nameSousGroup;
      const titleSeance = this.rapportForm.value.titleSeance;
  
      // Create a rapport object with today's date automatically set
      const rapportData = {
        ...this.rapportForm.value,
        dateRapport: new Date() // Automatically set today's date
      };
  
      // Call service to add rapport with player number
      this.rapportService.addRapport(rapportData, numeroJoueur, nameSousGroup, titleSeance).subscribe({
        next: () => {
          // Rediriger directement vers la page des rapports avec rechargement complet
          window.location.href = '/analyste/Reportshow';
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l\'ajout du rapport.';
          console.error('Error adding rapport:', err);
          
          // En cas d'erreur, on peut soit rester sur la page, soit rediriger quand même
          // window.location.href = '/analyste/Reportshow';
        }
      });
    } else {
      // Mark all form controls as touched to trigger validation messages
      Object.keys(this.rapportForm.controls).forEach(key => {
        this.rapportForm.get(key)?.markAsTouched();
      });
    }
  }

  nextSection(): void {
    const currentIndex = this.sections.indexOf(this.currentSection);
    if (currentIndex < this.sections.length - 1) {
      this.currentSection = this.sections[currentIndex + 1];
    }
  }

  prevSection(): void {
    const currentIndex = this.sections.indexOf(this.currentSection);
    if (currentIndex > 0) {
      this.currentSection = this.sections[currentIndex - 1];
    }
  }

  goToSection(section: string): void {
    if (this.sections.includes(section)) {
      this.currentSection = section;
    }
  }

  // Get player initials
  getPlayerInitials(): string {
    if (this.selectedJoueur) {
      return (this.selectedJoueur.prenomUser.charAt(0) + this.selectedJoueur.nameUsers.charAt(0)).toUpperCase();
    }
    
    const formValue = this.rapportForm.get('numeroJoueur')?.value;
    const joueur = this.filteredJoueurs.find(j => Number(j.numeroJoueur) === Number(formValue));
    if (joueur) {
      return (joueur.prenomUser.charAt(0) + joueur.nameUsers.charAt(0)).toUpperCase();
    }
    return '';
  }

  // Get selected player full name
  getSelectedPlayerName(): string {
    if (this.selectedJoueur) {
      return `${this.selectedJoueur.prenomUser} ${this.selectedJoueur.nameUsers}`;
    }
    
    const formValue = this.rapportForm.get('numeroJoueur')?.value;
    const joueur = this.filteredJoueurs.find(j => Number(j.numeroJoueur) === Number(formValue));
    if (joueur) {
      return `${joueur.prenomUser} ${joueur.nameUsers}`;
    }
    return '';
  }

  // Get current date formatted
  getCurrentDate(): string {
    const today = new Date();
    return today.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  // Status class methods
  getStatusClass(status: string): string {
    if (status === "Active") return "status-active";
    if (status === "Inactive") return "status-inactive";
    return "";
  }

  getInjuryClass(injury: string): string {
    if (injury === "None") return "injury-none";
    if (injury === "Minor") return "injury-minor";
    if (injury === "Moderate") return "injury-moderate";
    if (injury === "Severe") return "injury-severe";
    return "";
  }

  avoidAdd() {
    this.router.navigate(['analyste/Reportshow']); // Navigate to reports page
  }
}