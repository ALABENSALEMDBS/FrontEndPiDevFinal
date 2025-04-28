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
        Validators.pattern("^[a-zA-ZÀ-ÿ0-9\\s\\-'’]+$")
      ]),
      typeSeance: new FormControl("", [
        Validators.required
      ]),
      jourSeance: new FormControl("", [
        Validators.required
      ]),
      heureDebut: new FormControl("", [
        Validators.required
      ]),
      heureFin: new FormControl("", [
        Validators.required
      ]),
      durationMinutes: new FormControl("", [
        Validators.required,
        Validators.min(5),
        Validators.max(240)
      ]),
      description: new FormControl("", [
        Validators.maxLength(500),
        Validators.minLength(5),
        Validators.pattern("^[a-zA-ZÀ-ÿ0-9\\s\\-'’,.()!?]{5,500}$")
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
    this.seanceForm.setValidators(this.validateHeureFinApresHeureDebut);


  }
  validateHeureFinApresHeureDebut(group: AbstractControl): ValidationErrors | null {
    const start = group.get('heureDebut')?.value;
    const end = group.get('heureFin')?.value;
  
    if (start && end && start >= end) {
      return { heureInvalide: true };
    }
    return null;
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

    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`)
      const end = new Date(`2000-01-01T${endTime}`)

      // If end time is before start time, assume it's the next day
      let diff = end.getTime() - start.getTime()
      if (diff < 0) {
        diff += 24 * 60 * 60 * 1000 // Add 24 hours
      }

      const durationMinutes = Math.round(diff / 60000)
      this.seanceForm.get("durationMinutes")?.setValue(durationMinutes)
    }
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

          // Show success message for a moment, then reload the page
          setTimeout(() => {
            this.seanceForm.reset()
            window.location.reload() // Reload the page instead of navigating
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
    this.router.navigate(["coatch/showseance"])
  }
}

