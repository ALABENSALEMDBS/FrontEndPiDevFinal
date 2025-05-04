import { Component } from "@angular/core"
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { SeanceService } from "src/app/services/serviceCoatch/serviceSeance/seance.service"

@Component({
  selector: "app-addseance",
  templateUrl: "./addseance.component.html",
  styleUrls: ["./addseance.component.css"],
  standalone: false,
})
export class AddseanceComponent {
  seanceForm: FormGroup
  successMessage = ""
  errorMessage = ""
  currentSection = "details"
  sections: string[] = ["details", "schedule", "location", "intensity"]
  isVisible = true

  constructor(
    private seanceService: SeanceService,
    private router: Router,
  ) {
    this.seanceForm = new FormGroup({
      titleSeance: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern("^[a-zA-ZÀ-ÿ0-9\\s\\-'']+$")
      ]),
      typeSeance: new FormControl("", [
        Validators.required
      ]),
      jourSeance: new FormControl("", [
        Validators.required
      ]),
      heureDebut: new FormControl("", [
        Validators.required,
        Validators.pattern("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"),
        this.validateTimeFormat
      ]),
      heureFin: new FormControl("", [
        Validators.required,
        Validators.pattern("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$"),
        this.validateTimeFormat
      ]),
      durationMinutes: new FormControl("", [
        Validators.required,
        Validators.min(5),
        Validators.max(240)
      ]),
      description: new FormControl("", [
        Validators.maxLength(500),
        Validators.minLength(5),
        Validators.pattern("^[a-zA-ZÀ-ÿ0-9\\s\\-'',.()!?]{5,500}$")
      ]),
      
      location: new FormControl("", [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern("^[a-zA-ZÀ-ÿ0-9\\s\\-'().]{2,100}$")
      ]),
      
      intensityLevel: new FormControl("", [
        Validators.required,
        Validators.min(1),
        Validators.max(10)
      ])
    })
    
    // Add form-level validator for time comparison
    this.seanceForm.setValidators(this.validateHeureFinApresHeureDebut);

    // Add value change listeners to automatically calculate duration
    this.seanceForm.get('heureDebut')?.valueChanges.subscribe(() => {
      this.calculateDuration();
    });
    
    this.seanceForm.get('heureFin')?.valueChanges.subscribe(() => {
      this.calculateDuration();
    });
    
    // Add value change listener for duration to update end time
    this.seanceForm.get('durationMinutes')?.valueChanges.subscribe(() => {
      this.updateEndTimeFromDuration();
    });
  }

  // Validator for time format (HH:MM)
  validateTimeFormat(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timePattern.test(control.value)) {
      return { invalidTimeFormat: true };
    }
    
    return null;
  }
  
  validateHeureFinApresHeureDebut(group: AbstractControl): ValidationErrors | null {
    const start = group.get('heureDebut')?.value;
    const end = group.get('heureFin')?.value;
  
    if (start && end && start >= end) {
      return { heureInvalide: true };
    }
    return null;
  }
  
  // Helper method to get error messages for time fields
  getTimeErrorMessage(controlName: string): string {
    const control = this.seanceForm.get(controlName);
    if (!control || !control.errors || !control.touched) return '';
    
    if (control.errors['required']) {
      return 'Time is required';
    }
    if (control.errors['pattern'] || control.errors['invalidTimeFormat']) {
      return 'Invalid time format (HH:MM)';
    }
    
    return '';
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

  prevSection(): void {
    const currentIndex = this.sections.indexOf(this.currentSection)
    if (currentIndex > 0) {
      this.currentSection = this.sections[currentIndex - 1]
    }
  }

  getProgressPercentage(): number {
    const currentIndex = this.sections.indexOf(this.currentSection)
    return ((currentIndex + 1) / this.sections.length) * 100
  }

  // Calculate duration automatically based on start and end times
  calculateDuration(): void {
    const startTime = this.seanceForm.get("heureDebut")?.value
    const endTime = this.seanceForm.get("heureFin")?.value

    if (startTime && endTime && 
        this.isValidTimeFormat(startTime) && 
        this.isValidTimeFormat(endTime)) {
      const start = new Date(`2000-01-01T${startTime}`)
      const end = new Date(`2000-01-01T${endTime}`)

      // If end time is before start time, assume it's the next day
      let diff = end.getTime() - start.getTime()
      if (diff < 0) {
        diff += 24 * 60 * 60 * 1000 // Add 24 hours
      }

      // Temporarily remove the valueChanges subscription to avoid infinite loop
      const durationControl = this.seanceForm.get("durationMinutes");
      const durationSubs = durationControl?.valueChanges.subscribe();
      durationSubs?.unsubscribe();
      
      const durationMinutes = Math.round(diff / 60000)
      durationControl?.setValue(durationMinutes, { emitEvent: false });
      
      // Resubscribe after setting the value
      durationControl?.valueChanges.subscribe(() => {
        this.updateEndTimeFromDuration();
      });
    }
  }
  
  // Update end time based on start time and duration
  updateEndTimeFromDuration(): void {
    const startTime = this.seanceForm.get("heureDebut")?.value;
    const durationMinutes = this.seanceForm.get("durationMinutes")?.value;
    
    if (startTime && durationMinutes && 
        this.isValidTimeFormat(startTime) && 
        !isNaN(durationMinutes)) {
      
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(start.getTime() + durationMinutes * 60000);
      
      // Format the end time as HH:MM
      const hours = end.getHours().toString().padStart(2, '0');
      const minutes = end.getMinutes().toString().padStart(2, '0');
      const endTimeString = `${hours}:${minutes}`;
      
      // Temporarily remove the valueChanges subscription to avoid infinite loop
      const endTimeControl = this.seanceForm.get("heureFin");
      const endTimeSubs = endTimeControl?.valueChanges.subscribe();
      endTimeSubs?.unsubscribe();
      
      endTimeControl?.setValue(endTimeString, { emitEvent: false });
      
      // Resubscribe after setting the value
      endTimeControl?.valueChanges.subscribe(() => {
        this.calculateDuration();
      });
    }
  }
  
  // Helper method to check if a time string is in valid format
  isValidTimeFormat(time: string): boolean {
    const timePattern = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timePattern.test(time);
  }

  addSeance() {
    console.log("Form Submitted", this.seanceForm.value)
    if (this.seanceForm.valid) {
      // Calculate duration if not manually set
      if (!this.seanceForm.get("durationMinutes")?.value) {
        this.calculateDuration()
      }

      this.seanceService.addSeances(this.seanceForm.value).subscribe({
        next: () => {
          this.successMessage = "Séance ajoutée avec succès !"
          this.errorMessage = ""
          window.location.reload();


          // Show success message for a moment, then close the form and reload
          setTimeout(() => {
            this.avoidAdd(); // Close the form automatically
          }, 2000)
        },
        error: (err) => {
          console.error("Error adding seance", err)
          this.errorMessage = "Erreur lors de l'ajout de la séance."
          this.successMessage = ""
        },
      })
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.seanceForm.controls).forEach((key) => {
        this.seanceForm.get(key)?.markAsTouched()
      })

      this.errorMessage = "Veuillez corriger les erreurs dans le formulaire."
    }
  }

  avoidAdd() {
    // Navigate to the show seance page
    this.router.navigate(["coatch/showseance"])
  }
}