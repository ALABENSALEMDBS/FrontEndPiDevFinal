import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SeanceService } from 'src/app/services/serviceCoatch/serviceSeance/seance.service';

@Component({
    selector: 'app-addseance',
    templateUrl: './addseance.component.html',
    styleUrls: ['./addseance.component.css'],
    standalone: false
})
export class AddseanceComponent {
  seanceForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  currentSection = "details"
  sections: string[] = ["details", "schedule", "location", "intensity"]


  constructor(private seanceService: SeanceService, private rout: Router) {
    this.seanceForm = new FormGroup({
      titleSeance: new FormControl('', [Validators.required, Validators.minLength(3)]),
      jourSeance: new FormControl('', [Validators.required]),
      heureDebut: new FormControl('', [Validators.required]),
      heureFin: new FormControl('', [Validators.required]),
      description: new FormControl(''),
      location: new FormControl('', [Validators.required]),
      intensityLevel: new FormControl('', [Validators.required, Validators.min(1), Validators.max(10)])
    });
  }
  setCurrentSection(section: string): void {
    this.currentSection = section
  }

  nextSection(): void {
    const currentIndex = this.sections.indexOf(this.currentSection)
    if (currentIndex < this.sections.length - 1) {
      this.currentSection = this.sections[currentIndex + 1]
    }
  }

  // Move to the previous section
  prevSection(): void {
    const currentIndex = this.sections.indexOf(this.currentSection)
    if (currentIndex > 0) {
      this.currentSection = this.sections[currentIndex - 1]
    }
  }

  // Calculate progress percentage
  getProgressPercentage(): number {
    const currentIndex = this.sections.indexOf(this.currentSection)
    return ((currentIndex + 1) / this.sections.length) * 100
  }

  addSeance() {
    console.log("Form Submitted", this.seanceForm.value); // Log form data
    if (this.seanceForm.valid) {
      this.seanceService.addSeances(this.seanceForm.value).subscribe({
        next: () => {
          this.successMessage = 'Séance ajoutée avec succès !';
          this.errorMessage = '';
          this.seanceForm.reset();
          window.location.reload();
        },
        error: (err) => {
          console.error("Error adding seance", err); // Log error
          this.errorMessage = 'Erreur lors de l’ajout de la séance.';
          this.successMessage = '';
        }
      });
    } else {
      console.log("Form is invalid");
    }
  }
  
  avoidAdd() {
    this.rout.navigate(['coatch/showseance']); // Changez '/listformation' selon votre route réelle
  }
}