import { Component, EventEmitter, Input, type OnInit, Output } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"

import type { seance } from "src/core/models/seance"
import type { Exercices } from "src/core/models/exercice"
import { ActivatedRoute, Router } from "@angular/router"
import { SeanceService } from "src/app/services/serviceCoatch/serviceSeance/seance.service"
import { ExerciceService } from "src/app/services/serviceCoatch/serviceExercice/exercice.service"

// Define an interface for exercise objects with idExercice
interface ExerciceWithId {
  idExercice: number
  [key: string]: any // Allow other properties
}

@Component({
  selector: "app-affectsessionexercice",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./affectsessionexercice.component.html",
  styleUrl: "./affectsessionexercice.component.css",
})
export class AffectsessionexerciceComponent implements OnInit {
  // Add these Input and Output properties for modal functionality
  @Input() seance: seance | null = null
  @Input() isModal = false
  @Input() idSeance: number | null = null
  @Output() closeModal = new EventEmitter<void>()

  seanceId = 0

  // Exercise lists
  availableExercices: Exercices[] = [] // All exercises available for this session
  compatibleExerciceIds: number[] = [] // IDs of exercises compatible with session intensity
  assignedExercices: Exercices[] = [] // Exercises already assigned to this session
  selectedExerciceIds: number[] = []
  assignedExerciceIds: number[] = [] // Array to track already assigned exercises IDs

  message = ""
  loading = false
  maxExercisesAllowed = 0 // Maximum number of exercises allowed

  // Compatibility reasons for filtering
  compatibilityReasons: Record<number, string> = {}

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seanceService: SeanceService,
    private exerciceService: ExerciceService,
  ) {}

  ngOnInit(): void {
    console.log("Component initialized")

    // If we're in modal mode and have a seance or idSeance input
    if (this.isModal) {
      if (this.seance) {
        console.log("Using provided seance in modal mode:", this.seance)
        this.seanceId = this.seance.idSeance
        this.loadExercices()
        this.calculateMaxExercises() // Calculate max exercises allowed
      } else if (this.idSeance) {
        console.log("Using provided idSeance in modal mode:", this.idSeance)
        this.seanceId = this.idSeance
        this.loadSeanceDetails()
        this.loadExercices()
      }
    } else {
      // Original route parameter logic for standalone page mode
      this.route.params.subscribe((params) => {
        this.seanceId = +params["id"] // Convert to number
        console.log("Seance ID from route:", this.seanceId)
        if (this.seanceId) {
          this.loadSeanceDetails()
          this.loadExercices()
        }
      })
    }
  }

  loadSeanceDetails(): void {
    console.log("Loading seance details for ID:", this.seanceId)
    this.seanceService.getbyidSeances(this.seanceId).subscribe({
      next: (data) => {
        console.log("Seance data received:", data)
        // Fix: Check if data is an array and extract the first element
        if (Array.isArray(data) && data.length > 0) {
          this.seance = data[0] // Get the first seance from the array
          console.log("Seance set from array:", this.seance)
        } else if (!Array.isArray(data)) {
          // If data is already a single object
          this.seance = data
          console.log("Seance set from object:", this.seance)
        } else {
          console.error("No seance found with this ID")
          this.message = "No seance found with this ID"
        }
        this.calculateMaxExercises() // Calculate max exercises after loading seance
      },
      error: (error) => {
        console.error("Error loading seance details:", error)
        this.message = "Error loading seance details"
      },
    })
  }

  // Load all required exercise data
  loadExercices(): void {
    if (!this.seanceId) {
      console.error("Cannot load exercises: seanceId is not set")
      return
    }

    // Load exercises already assigned to this session
    this.loadAssignedExercices()

    // Load available exercises (not assigned to any session or this session)
    this.loadAvailableExercices()
  }

  loadAvailableExercices(): void {
    console.log("Loading available exercises for session ID:", this.seanceId)
  
    this.seanceService.findAvailableExercices(this.seanceId).subscribe({
      next: (data) => {
        console.log("Available exercises data received:", data)
        this.availableExercices = data
  
        // Load compatible exercises directly from the API
        this.loadCompatibleExercices()
      },
      error: (error) => {
        console.error("Error loading available exercises:", error)
        this.message = "Error loading available exercises"
      },
    })
  }

  // Load compatible exercises from the API
  loadCompatibleExercices(): void {
    console.log("Loading compatible exercises for session ID:", this.seanceId)
  
    this.seanceService.getCompatibleExercices(this.seanceId).subscribe({
      next: (data) => {
        console.log("Compatible exercises data received:", data)
  
        // Store the IDs of compatible exercises
        this.compatibleExerciceIds = data.map((exercise) => exercise.idExercice)
  
        // Set compatibility reasons
        this.setCompatibilityReasons()
  
        console.log(
          `Found ${this.compatibleExerciceIds.length} compatible exercises out of ${this.availableExercices.length} total`,
        )
      },
      error: (error) => {
        console.error("Error loading compatible exercises:", error)
        this.message = "Error loading compatible exercises"
        // Initialize empty array to prevent further errors
        this.compatibleExerciceIds = []
      },
    })
  }

  // Set compatibility reasons for all exercises
  setCompatibilityReasons(): void {
    if (!this.seance) {
      console.warn("Cannot set compatibility reasons: seance is null")
      return
    }

    const intensity = this.seance.intensityLevel || 0
    const duration = this.seance.durationMinutes || 0

    this.compatibilityReasons = {}

    // Process all available exercises to set compatibility reasons
    this.availableExercices.forEach((exercise) => {
      const exerciseId = exercise.idExercice
      const exerciseType = exercise.exercicetype?.toLowerCase() || ""
      const isCompatible = this.compatibleExerciceIds.includes(exerciseId)
      let reason = ""

      // Set reason based on compatibility and exercise type
      if (isCompatible) {
        if (["stretching", "mobility", "breathing"].some((type) => exerciseType.includes(type))) {
          reason = "Compatible: Low intensity exercise"
        } else if (["dribble", "passing", "agility"].some((type) => exerciseType.includes(type))) {
          reason = "Compatible: Medium intensity exercise"
        } else if (["endurance", "strength", "speed", "tactical"].some((type) => exerciseType.includes(type))) {
          reason = "Compatible: High intensity exercise"
        } else if (["high speed", "sprint", "anaerobic"].some((type) => exerciseType.includes(type))) {
          reason = "Compatible: Very high intensity exercise"
        } else {
          reason = "Compatible: General exercise"
        }
      } else {
        if (["stretching", "mobility", "breathing"].some((type) => exerciseType.includes(type))) {
          reason = `Incompatible: Requires intensity ≤ 3 (current: ${intensity})`
        } else if (["dribble", "passing", "agility"].some((type) => exerciseType.includes(type))) {
          reason = `Incompatible: Requires intensity 4-6 (current: ${intensity}) and duration ≥ 30 min (current: ${duration})`
        } else if (["endurance", "strength", "speed", "tactical"].some((type) => exerciseType.includes(type))) {
          reason = `Incompatible: Requires intensity ≥ 7 (current: ${intensity}) and duration ≥ 45 min (current: ${duration})`
        } else if (["high speed", "sprint", "anaerobic"].some((type) => exerciseType.includes(type))) {
          reason = `Incompatible: Requires intensity ≥ 8 (current: ${intensity}) and duration ≥ 60 min (current: ${duration})`
        } else {
          reason = "Incompatible: Does not meet session requirements"
        }
      }

      // Store the compatibility reason
      this.compatibilityReasons[exerciseId] = reason
    })
  }

  // Method to load exercises already assigned to this session
  loadAssignedExercices(): void {
    console.log("Loading exercises assigned to seance ID:", this.seanceId)

    // Add error handling with a fallback
    this.seanceService.findBySeanceExerciceIdSeance(this.seanceId).subscribe({
      next: (data) => {
        console.log("Assigned exercises data received:", data)
        // Check if data is null or undefined
        if (!data) {
          console.warn("Received null or undefined data for assigned exercises")
          this.assignedExerciceIds = []
          this.assignedExercices = []
          return
        }

        // Check if data is an array
        if (!Array.isArray(data)) {
          console.warn("Received non-array data for assigned exercises:", data)
          // Try to handle it if it's a single object
          if (data && typeof data === "object") {
            // Type assertion to tell TypeScript this is an object with idExercice
            const exerciseObj = data as ExerciceWithId
            if ("idExercice" in exerciseObj) {
              this.assignedExerciceIds = [exerciseObj.idExercice]
              this.assignedExercices = [exerciseObj as unknown as Exercices]
            } else {
              // If it's an object with multiple exercises
              try {
                const exerciseArray = Object.values(data)
                const typedExercises = exerciseArray.filter((ex): ex is ExerciceWithId => {
                  return ex !== null && typeof ex === "object" && "idExercice" in ex
                })
                this.assignedExerciceIds = typedExercises.map((ex) => ex.idExercice)
                this.assignedExercices = typedExercises as unknown as Exercices[]
              } catch (e) {
                console.error("Error processing non-array data:", e)
                this.assignedExerciceIds = []
                this.assignedExercices = []
              }
            }
          } else {
            this.assignedExerciceIds = []
            this.assignedExercices = []
          }
          return
        }

        // Extract just the IDs of assigned exercises
        // Use type assertion to tell TypeScript these are objects with idExercice
        this.assignedExerciceIds = (data as ExerciceWithId[]).map((exercise) => exercise.idExercice)
        this.assignedExercices = data as Exercices[]
        console.log("Assigned exercise IDs:", this.assignedExerciceIds)
      },
      error: (error) => {
        console.error("Error loading assigned exercises:", error)
        // More detailed error logging
        if (error.status) {
          console.error(`HTTP Status: ${error.status}`)
        }
        if (error.message) {
          console.error(`Error message: ${error.message}`)
        }

        // Set a user-friendly message
        this.message = "Could not load assigned exercises. Continuing with available exercises."

        // Initialize empty array to prevent further errors
        this.assignedExerciceIds = []
        this.assignedExercices = []
      },
    })
  }

  // Calculate maximum exercises allowed based on intensity and duration
  calculateMaxExercises(): void {
    if (!this.seance) {
      console.warn("Cannot calculate max exercises: seance is null")
      return
    }

    const intensity = this.seance.intensityLevel || 0
    const durationMinutes = this.seance.durationMinutes || 0
    const isLongSession = durationMinutes >= 60 // Assuming 60+ minutes is a long session

    // Determine max exercises based on intensity level and duration
    if (intensity >= 8) {
      // High intensity (8-10)
      this.maxExercisesAllowed = isLongSession ? 10 : 7
    } else if (intensity >= 5) {
      // Medium intensity (5-7)
      this.maxExercisesAllowed = isLongSession ? 7 : 5
    } else {
      // Low intensity (1-4)
      this.maxExercisesAllowed = isLongSession ? 5 : 3
    }

    console.log(
      `Max exercises allowed: ${this.maxExercisesAllowed} (Intensity: ${intensity}, Duration: ${durationMinutes}min)`,
    )
  }

  // Check if an exercise is already assigned to this session
  isExerciceAssigned(exerciceId: number): boolean {
    return this.assignedExerciceIds.includes(exerciceId)
  }

  // Check if an exercise is compatible with the session
  isExerciceCompatible(exerciceId: number): boolean {
    return this.compatibleExerciceIds.includes(exerciceId)
  }

  // Check if maximum exercises limit is reached
  isMaxExercisesReached(): boolean {
    const totalSelected = this.selectedExerciceIds.length + this.assignedExerciceIds.length
    return totalSelected >= this.maxExercisesAllowed
  }

  // Check if a specific exercise can be selected
  canSelectExercise(exerciceId: number): boolean {
    // First check if the exercise is compatible
    if (!this.isExerciceCompatible(exerciceId)) {
      return false // Block selection if not compatible
    }

    // If already assigned or selected, it's fine
    if (this.isExerciceAssigned(exerciceId) || this.selectedExerciceIds.includes(exerciceId)) {
      return true
    }

    // Otherwise, check if adding one more would exceed the limit
    return !this.isMaxExercisesReached()
  }

  // Get compatibility reason for an exercise
  getCompatibilityReason(exerciceId: number): string {
    return this.compatibilityReasons[exerciceId] || "Unknown compatibility status"
  }

  // Handle checkbox changes
  handleCheckboxChange(event: Event, exerciceId: number): void {
    const checkbox = event.target as HTMLInputElement

    // Check if the exercise is compatible
    if (!this.isExerciceCompatible(exerciceId)) {
      checkbox.checked = false
      this.message = "This exercise is not compatible with the session's intensity and duration."
      return
    }

    // Only process the change if the exercise is not already assigned or if it's being unassigned
    if (this.isExerciceAssigned(exerciceId)) {
      // If it's already assigned, handle unassigning
      this.unassignExercice(exerciceId)
      return
    }

    // If trying to check and we're at the limit, prevent it
    if (checkbox.checked && this.isMaxExercisesReached() && !this.selectedExerciceIds.includes(exerciceId)) {
      checkbox.checked = false
      this.message = `Maximum of ${this.maxExercisesAllowed} exercises allowed for this session's intensity and duration.`
      return
    }

    this.onExerciceSelectionChange(exerciceId, checkbox.checked)

    // Clear message when deselecting
    if (!checkbox.checked) {
      this.message = ""
    }
  }

  onExerciceSelectionChange(exerciceId: number, isChecked: boolean): void {
    console.log(`Exercise ${exerciceId} selection changed to ${isChecked}`)
    if (isChecked) {
      // Only add if not already in the array
      if (!this.selectedExerciceIds.includes(exerciceId)) {
        this.selectedExerciceIds.push(exerciceId)
      }
    } else {
      this.selectedExerciceIds = this.selectedExerciceIds.filter((id) => id !== exerciceId)
    }
    console.log("Selected exercise IDs:", this.selectedExerciceIds)
  }

  // Get remaining exercises that can be selected
  getRemainingExercises(): number {
    return Math.max(0, this.maxExercisesAllowed - this.assignedExerciceIds.length - this.selectedExerciceIds.length)
  }

  // Add a method to handle unassigning exercises
  unassignExercice(exerciceId: number): void {
    // If the exercise is already in the selectedExerciceIds array, remove it
    if (this.selectedExerciceIds.includes(exerciceId)) {
      this.selectedExerciceIds = this.selectedExerciceIds.filter((id) => id !== exerciceId)
    } else {
      // Otherwise, add it to the list of exercises to unassign
      this.selectedExerciceIds.push(exerciceId)
    }
  }

  // Update the assignExercices method to handle both assigning and unassigning
  assignExercices(): void {
    if (!this.seanceId) {
      this.message = "Session ID is not set"
      return
    }

    if (this.selectedExerciceIds.length === 0) {
      this.message = "Please select at least one exercise"
      return
    }

    console.log(`Processing exercises ${this.selectedExerciceIds} for seance ${this.seanceId}`)
    this.loading = true

    // Determine which exercises are to be assigned and which are to be unassigned
    const exercisesToAssign = this.selectedExerciceIds.filter((id) => !this.assignedExerciceIds.includes(id))
    const exercisesToUnassign = this.selectedExerciceIds.filter((id) => this.assignedExerciceIds.includes(id))

    // Track completed operations
    let completedOperations = 0
    const totalOperations = (exercisesToAssign.length > 0 ? 1 : 0) + (exercisesToUnassign.length > 0 ? 1 : 0)
    
    const checkCompletion = () => {
      completedOperations++
      if (completedOperations === totalOperations) {
        this.loading = false
        this.loadExercices() // Refresh the lists
        this.selectedExerciceIds = [] // Clear selection
        
        // If in modal mode, close the modal after a delay
        if (this.isModal) {
          setTimeout(() => {
            this.closeModal.emit()
          }, 2000)
        }
      }
    }

    // If there are exercises to assign, assign them
    if (exercisesToAssign.length > 0) {
      this.seanceService.affecterExercisesASeance(this.seanceId, exercisesToAssign).subscribe({
        next: () => {
          console.log("Exercises assigned successfully")
          this.message = exercisesToUnassign.length > 0 
            ? "Processing changes..." 
            : "Exercises assigned successfully!"
          checkCompletion()
        },
        error: (error) => {
          console.error("Error assigning exercises:", error)
          this.message = "Error assigning exercises"
          this.loading = false
        },
      })
    }
    
    // If there are exercises to unassign, unassign them
   
  }

  goBack(): void {
    if (this.isModal) {
      // If in modal mode, emit the close event
      this.closeModal.emit()
    } else {
      // Original navigation logic
      this.router.navigate(["/coatch/showseance"]) // Updated to match your route structure
    }
  }
}