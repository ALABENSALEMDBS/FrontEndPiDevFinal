import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { RapportService } from 'src/app/services/serviceAnalyste/gerer-rapport/rapport.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

// Import models
import { Joueurs } from 'src/core/models/joueur';
import { sousgroup } from 'src/core/models/sousgroup';
import { seance } from 'src/core/models/seance';
import { Rapport } from 'src/core/models/rapport';
import { CommonModule } from '@angular/common';

// Custom validator function for numeric fields
function numericRangeValidator(min: number, max: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    // Check if value exists and is a number
    if (value === null || value === undefined || value === '') {
      return null; // Let required validator handle empty values
    }
    
    const numValue = Number(value);
    
    // Check if it's a valid number
    if (isNaN(numValue)) {
      return { 'notANumber': true };
    }
    
    // Check if it's within range
    if (numValue < min || numValue > max) {
      return { 'outOfRange': { min, max, actual: numValue } };
    }
    
    return null;
  };
}

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
  formSubmitted: boolean = false;

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
      speedRapport: ['', [
        Validators.required, 
        numericRangeValidator(0, 100)
      ]],
      accelerationRapport: ['', [
        Validators.required, 
        numericRangeValidator(0, 100)
      ]],
      endurance: ['', [
        Validators.required, 
        numericRangeValidator(0, 100)
      ]],
      muscularEndurance: ['', [
        Validators.required, 
        numericRangeValidator(0, 100)
      ]],
      aerobicCapacity: ['', [
        Validators.required, 
        numericRangeValidator(0, 100)
      ]],
      anaerobicCapacity: ['', [
        Validators.required, 
        numericRangeValidator(0, 100)
      ]],
      strength: ['', [
        Validators.required, 
        numericRangeValidator(0, 100)
      ]],
      power: ['', [
        Validators.required, 
        numericRangeValidator(0, 100)
      ]],
      explosiveness: ['', [
        Validators.required, 
        numericRangeValidator(0, 100)
      ]],
      verticalJump: ['', [
        Validators.required, 
        numericRangeValidator(0, 100)
      ]],
      horizontalJump: ['', [
        Validators.required, 
        numericRangeValidator(0, 100)
      ]],
      agility: ['', [
        Validators.required, 
        numericRangeValidator(0, 100)
      ]],
      balance: ['', [
        Validators.required, 
        numericRangeValidator(0, 100)
      ]],
      coordination: ['', [
        Validators.required, 
        numericRangeValidator(0, 100)
      ]],
      reactionTime: ['', [
        Validators.required, 
        numericRangeValidator(0, 100)
      ]],
      reactivity: ['', [
        Validators.required, 
        numericRangeValidator(0, 100)
      ]],
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
    
    // Add debounced validation for better UX
    Object.keys(this.rapportForm.controls).forEach(key => {
      this.rapportForm.get(key)?.valueChanges
        .pipe(
          debounceTime(300),
          distinctUntilChanged()
        )
        .subscribe(() => {
          // This will trigger validation after the user stops typing
          this.rapportForm.get(key)?.updateValueAndValidity();
        });
    });
  }

  // Helper method to check if a field is invalid and touched
  isFieldInvalid(fieldName: string): boolean {
    const field = this.rapportForm.get(fieldName);
    return field ? (field.invalid && (field.dirty || field.touched || this.formSubmitted)) : false;
  }
  
  // Helper method to check if a field is valid and touched
  isFieldValid(fieldName: string): boolean {
    const field = this.rapportForm.get(fieldName);
    return field ? (field.valid && (field.dirty || field.touched)) : false;
  }
  
  // Helper method to get error message for a field
  getErrorMessage(fieldName: string): string {
    const field = this.rapportForm.get(fieldName);
    if (!field) return '';
    
    if (field.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    
    if (field.hasError('notANumber')) {
      return 'Veuillez entrer un nombre valide';
    }
    
    if (field.hasError('outOfRange')) {
      const error = field.getError('outOfRange');
      return `La valeur doit être entre ${error.min} et ${error.max}`;
    }
    
    return '';
  }
  
  // Check if section has any errors
  hasSectionErrors(section: string): boolean {
    let hasErrors = false;
    
    if (section === 'player') {
      hasErrors = this.isFieldInvalid('numeroJoueur') || 
                 this.isFieldInvalid('nameSousGroup') || 
                 this.isFieldInvalid('titleSeance');
    } else if (section === 'performance') {
      hasErrors = this.isFieldInvalid('speedRapport') || 
                 this.isFieldInvalid('accelerationRapport') || 
                 this.isFieldInvalid('endurance') ||
                 this.isFieldInvalid('muscularEndurance') ||
                 this.isFieldInvalid('aerobicCapacity') ||
                 this.isFieldInvalid('anaerobicCapacity');
    } else if (section === 'strength') {
      hasErrors = this.isFieldInvalid('strength') || 
                 this.isFieldInvalid('power') || 
                 this.isFieldInvalid('explosiveness') ||
                 this.isFieldInvalid('verticalJump') ||
                 this.isFieldInvalid('horizontalJump');
    } else if (section === 'agility') {
      hasErrors = this.isFieldInvalid('agility') || 
                 this.isFieldInvalid('balance') || 
                 this.isFieldInvalid('coordination') ||
                 this.isFieldInvalid('reactionTime') ||
                 this.isFieldInvalid('reactivity');
    } else if (section === 'state') {
      hasErrors = this.isFieldInvalid('etatRapport');
    }
    
    return hasErrors;
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
    this.formSubmitted = true;
    
    // Mark all fields as touched to trigger validation
    Object.keys(this.rapportForm.controls).forEach(key => {
      this.rapportForm.get(key)?.markAsTouched();
    });
    
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
          this.successMessage = 'Rapport ajouté avec succès!';
          // Rediriger directement vers la page des rapports avec rechargement complet
          setTimeout(() => {
            window.location.href = '/analyste/Reportshow';
          }, 1000);
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l\'ajout du rapport.';
          console.error('Error adding rapport:', err);
        }
      });
    } else {
      this.errorMessage = 'Veuillez corriger les erreurs dans le formulaire avant de soumettre.';
      
      // Find the first section with errors and navigate to it
      for (const section of this.sections) {
        if (this.hasSectionErrors(section)) {
          this.currentSection = section;
          break;
        }
      }
      
      // Scroll to the first error
      setTimeout(() => {
        const firstInvalidElement = document.querySelector('.is-invalid');
        if (firstInvalidElement) {
          firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  nextSection(): void {
    // Validate current section before proceeding
    let canProceed = true;
    
    if (this.currentSection === 'player') {
      // Mark player section fields as touched
      this.rapportForm.get('titleSeance')?.markAsTouched();
      this.rapportForm.get('nameSousGroup')?.markAsTouched();
      this.rapportForm.get('numeroJoueur')?.markAsTouched();
      
      canProceed = !this.hasSectionErrors('player');
    } else if (this.currentSection === 'performance') {
      // Mark performance section fields as touched
      this.rapportForm.get('speedRapport')?.markAsTouched();
      this.rapportForm.get('accelerationRapport')?.markAsTouched();
      this.rapportForm.get('endurance')?.markAsTouched();
      this.rapportForm.get('muscularEndurance')?.markAsTouched();
      this.rapportForm.get('aerobicCapacity')?.markAsTouched();
      this.rapportForm.get('anaerobicCapacity')?.markAsTouched();
      
      canProceed = !this.hasSectionErrors('performance');
    } else if (this.currentSection === 'strength') {
      // Mark strength section fields as touched
      this.rapportForm.get('strength')?.markAsTouched();
      this.rapportForm.get('power')?.markAsTouched();
      this.rapportForm.get('explosiveness')?.markAsTouched();
      this.rapportForm.get('verticalJump')?.markAsTouched();
      this.rapportForm.get('horizontalJump')?.markAsTouched();
      
      canProceed = !this.hasSectionErrors('strength');
    } else if (this.currentSection === 'agility') {
      // Mark agility section fields as touched
      this.rapportForm.get('agility')?.markAsTouched();
      this.rapportForm.get('balance')?.markAsTouched();
      this.rapportForm.get('coordination')?.markAsTouched();
      this.rapportForm.get('reactionTime')?.markAsTouched();
      this.rapportForm.get('reactivity')?.markAsTouched();
      
      canProceed = !this.hasSectionErrors('agility');
    }
    
    if (canProceed) {
      const currentIndex = this.sections.indexOf(this.currentSection);
      if (currentIndex < this.sections.length - 1) {
        this.currentSection = this.sections[currentIndex + 1];
        this.errorMessage = ''; // Clear error message when moving to next section
      }
    } else {
      this.errorMessage = 'Veuillez corriger les erreurs dans cette section avant de continuer.';
      
      // Scroll to the first error
      setTimeout(() => {
        const firstInvalidElement = document.querySelector('.is-invalid');
        if (firstInvalidElement) {
          firstInvalidElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }

  prevSection(): void {
    const currentIndex = this.sections.indexOf(this.currentSection);
    if (currentIndex > 0) {
      this.currentSection = this.sections[currentIndex - 1];
      this.errorMessage = ''; // Clear error message when moving to previous section
    }
  }

  goToSection(section: string): void {
    if (this.sections.includes(section)) {
      this.currentSection = section;
      this.errorMessage = ''; // Clear error message when changing sections
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