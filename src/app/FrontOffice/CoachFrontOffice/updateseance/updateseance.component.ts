import { Component, Input, type OnInit } from "@angular/core"
import { FormControl, FormGroup, Validators } from "@angular/forms"
import { ActivatedRoute, Router } from "@angular/router"
import { SeanceService } from "src/app/services/serviceCoatch/serviceSeance/seance.service"
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http"

import type { Exercices } from "src/core/models/exercice"

@Component({
  selector: "app-updateseance",
  templateUrl: "./updateseance.component.html",
  styleUrls: ["./updateseance.component.css"],
  standalone: false,
})
export class UpdateseanceComponent implements OnInit {
  @Input() seanceData: any

  idSeance: any
  seanceform!: FormGroup
  listseance: any[] = []
  exercises: Exercices[] = []
  availableExercises: Exercices[] = [] // Exercices disponibles (non affectés à d'autres séances)
  selectedExercises: number[] = []
  successMessage = ""
  errorMessage = ""
  currentSection = "details"
  sections: string[] = ["details", "schedule", "location", "intensity", "exercises"]
  
  // URL de base pour les requêtes HTTP directes
  private baseUrl = "http://localhost:8089/PiDevBackEndProject/seances"

  // New validation properties
  showValidationAlert = false
  validationMessage = ""
  showConfirmModal = false
  confirmMessage = ""
  pendingSubmission = false
  pendingAction: string = ""

  // Exercise limit properties
  maxExercisesAllowed: number = 10 // Default max
  
  // Loading state
  isLoadingExercises: boolean = false
  // Retry mechanism
  maxRetries: number = 3

  constructor(
    private act: ActivatedRoute,
    private service: SeanceService,
    private router: Router,
    private http: HttpClient // Ajout de HttpClient pour les requêtes directes
  ) {}

  ngOnInit(): void {
    this.idSeance = this.act.snapshot.params["idSeance"] || this.seanceData?.idSeance

    // Initialisation du formulaire avec tous les champs
    this.seanceform = new FormGroup({
      idSeance: new FormControl({ value: "", disabled: true }),
      titleSeance: new FormControl("", [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z0-9 ]*$/)  // Titre avec lettres, chiffres et espaces
      ]),
      typeSeance: new FormControl("", [Validators.required]),
      jourSeance: new FormControl("", [Validators.required]),
      heureDebut: new FormControl("", [Validators.required]),
      heureFin: new FormControl("", [Validators.required]),
      durationMinutes: new FormControl("", [
        Validators.required,
        Validators.min(5),
        Validators.max(240)
      ]),
      description: new FormControl("", [
        Validators.required,  // Champ obligatoire
        Validators.minLength(10),  // Minimum de 10 caractères
        Validators.maxLength(500),  // Maximum de 500 caractères
        Validators.pattern(/^[a-zA-Z0-9\s]*$/)  // Seulement lettres, chiffres et espaces
      ]),
            location: new FormControl("", [Validators.required]),
      intensityLevel: new FormControl("", [
        Validators.required,
        Validators.min(1),
        Validators.max(10)
      ])
    });
    
    // Custom validation methods
    this.seanceform.get('jourSeance')?.valueChanges.subscribe(() => {
      if (this.seanceform.get('jourSeance')?.value < new Date().toISOString().split('T')[0]) {
        this.seanceform.get('jourSeance')?.setErrors({ pastDate: true });
      }
    });
    

    // Charger les données de la séance à modifier
    this.service.getbyidSeances(this.idSeance).subscribe({
      next: (data) => {
        this.listseance = [data]

        // Assurez-vous que toutes les données sont correctement formatées
        const seanceData = this.listseance[0]

        // Log pour déboguer
        console.log("Données de séance chargées:", seanceData)

        // Mise à jour explicite de chaque champ du formulaire
        this.seanceform.patchValue({
          idSeance: seanceData.idSeance,
          titleSeance: seanceData.titleSeance,
          typeSeance: seanceData.typeSeance,
          jourSeance: seanceData.jourSeance,
          heureDebut: seanceData.heureDebut,
          heureFin: seanceData.heureFin,
          durationMinutes: seanceData.durationMinutes,
          description: seanceData.description,
          location: seanceData.location,
          intensityLevel: seanceData.intensityLevel,
        })

        // Vérifiez que le type de séance est correctement défini
        console.log("Type de séance défini:", this.seanceform.get("typeSeance")?.value)

        // Update max exercises allowed based on loaded data
        this.updateMaxExercisesAllowed();

        // Charger les exercices associés et les exercices disponibles
        this.loadExercises();
        this.loadAvailableExercises();
      },
      error: (err) => {
        this.errorMessage = "Erreur lors du chargement des données de la séance."
        console.error(err)
      },
    })
  }

  // Determine if an exercise can be selected based on limits
  canSelectMoreExercises(): boolean {
    return this.selectedExercises.length < this.maxExercisesAllowed;
  }

  // Update the maximum number of exercises allowed based on intensity and duration
  updateMaxExercisesAllowed(): void {
    const intensity = this.seanceform.get('intensityLevel')?.value || 5;
    const duration = this.seanceform.get('durationMinutes')?.value || 60;
    const isLongSession = duration >= 60; // Consider sessions 60+ minutes as "long"

    // High intensity (8-10): Up to 10 exercises for long sessions, 7 for shorter ones
    if (intensity >= 8 && intensity <= 10) {
      this.maxExercisesAllowed = isLongSession ? 10 : 7;
    }
    // Medium intensity (5-7): Up to 7 exercises for long sessions, 5 for shorter ones
    else if (intensity >= 5 && intensity <= 7) {
      this.maxExercisesAllowed = isLongSession ? 7 : 5;
    }
    // Low intensity (1-4): Up to 5 exercises for long sessions, 3 for shorter ones
    else {
      this.maxExercisesAllowed = isLongSession ? 5 : 3;
    }

    console.log(`Max exercises updated: ${this.maxExercisesAllowed} (Intensity: ${intensity}, Duration: ${duration})`);
  }

  // Charger les exercices associés à cette séance
  loadExercises(): void {
    this.isLoadingExercises = true;
    this.service.findBySeanceExerciceIdSeance(this.idSeance).subscribe({
      next: (data) => {
        this.exercises = data;
        // Initialiser les exercices sélectionnés
        this.selectedExercises = this.exercises.map((ex) => ex.idExercice);
        console.log("Exercices associés:", this.exercises);
        console.log("IDs des exercices sélectionnés:", this.selectedExercises);
        this.isLoadingExercises = false;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des exercices", err);
        this.isLoadingExercises = false;
      },
    });
  }

  // Charger les exercices disponibles (non affectés à d'autres séances)
  loadAvailableExercises(): void {
    this.isLoadingExercises = true;
    
    // Utiliser la méthode findAvailableExercices pour obtenir les exercices disponibles
    this.service.findAvailableExercices(this.idSeance).subscribe({
      next: (data) => {
        this.availableExercises = data;
        console.log("Exercices disponibles:", this.availableExercises);
        this.isLoadingExercises = false;
      },
      error: (err) => {
        console.error("Erreur lors du chargement des exercices disponibles", err);
        this.errorMessage = "Erreur lors du chargement des exercices disponibles.";
        this.isLoadingExercises = false;
      }
    });
  }

  // Vérifier si un exercice est sélectionné
  isExerciseSelected(exerciseId: number): boolean {
    return this.selectedExercises.includes(exerciseId);
  }

  // Check if an exercise can be selected (not already selected and within limits)
  canSelectExercise(exerciseId: number): boolean {
    return this.isExerciseSelected(exerciseId) || this.canSelectMoreExercises();
  }

  // Trouver le nom d'un exercice par son ID (méthode d'aide pour le template)
  getExerciseName(exerciseId: number): string {
    const exercise = this.availableExercises.find((ex) => ex.idExercice === exerciseId);
    return exercise ? exercise.nameExercice : "Exercice inconnu";
  }

  // MODIFIÉ: Gérer la sélection/désélection d'un exercice
  toggleExercise(exerciseId: number): void {
    const index = this.selectedExercises.indexOf(exerciseId);
    
    if (index === -1) {
      // Adding an exercise - check if we're at the limit
      if (this.selectedExercises.length >= this.maxExercisesAllowed) {
        // Show warning message
        this.showValidationAlert = true;
        this.validationMessage = `Vous ne pouvez pas sélectionner plus de ${this.maxExercisesAllowed} exercices pour une séance de cette intensité et durée.`;
        return;
      }
      
      // Ajouter l'exercice s'il n'est pas déjà sélectionné
      this.selectedExercises.push(exerciseId);
    } else {
      // Retirer l'exercice s'il est déjà sélectionné
      this.selectedExercises.splice(index, 1);
      
      // AJOUT: Appeler la méthode pour désaffecter l'exercice de la séance
      this.removeExerciseFromSession(exerciseId);
    }
    console.log("Exercices sélectionnés après modification:", this.selectedExercises);
  }

  // Helper method to extract error message from HTTP errors
  private extractErrorMessage(err: any): string {
    let errorMsg = "Erreur lors du retrait de l'exercice";
    
    if (err instanceof HttpErrorResponse) {
      console.log("Status code:", err.status);
      console.log("Status text:", err.statusText);
      console.log("URL:", err.url);
      console.log("Error object:", err.error);
      
      if (err.error instanceof ErrorEvent) {
        // Client-side error
        errorMsg += `: ${err.error.message}`;
      } else if (typeof err.error === 'string') {
        // Server returned error message as string
        errorMsg += `: ${err.error}`;
      } else if (err.error && err.error.message) {
        // Server returned error object with message
        errorMsg += `: ${err.error.message}`;
      } else {
        // Use status text
        errorMsg += `: ${err.statusText || 'Code ' + err.status}`;
      }
    } else if (err.message) {
      errorMsg += `: ${err.message}`;
    }
    
    return errorMsg;
  }

  // MODIFIÉ: Méthode pour désaffecter un exercice de la séance avec POST (corrigé)
  // Update the removeExerciseFromSession method in updateseance.component.ts
removeExerciseFromSession(exerciseId: number, retryCount: number = 0): void {
  // Ajouter un indicateur de chargement
  this.isLoadingExercises = true;
  
  // Effacer les messages précédents
  this.successMessage = "";
  this.errorMessage = "";
  
  // Log pour déboguer
  console.log(`Tentative de retrait de l'exercice ${exerciseId} de la séance ${this.idSeance}`);
  
  // Vérifier d'abord si l'exercice est réellement lié à la séance
  this.service.findBySeanceExerciceIdSeance(this.idSeance).subscribe({
    next: (exercises) => {
      // Vérifier si l'exercice est dans la liste des exercices de la séance
      const isLinked = exercises.some(ex => ex.idExercice === exerciseId);
      
      if (!isLinked) {
        console.log(`L'exercice ${exerciseId} n'est pas lié à la séance ${this.idSeance}. Mise à jour de l'interface.`);
        
        // Si l'exercice n'est pas lié, le retirer simplement de la liste des sélectionnés
        const index = this.selectedExercises.indexOf(exerciseId);
        if (index !== -1) {
          this.selectedExercises.splice(index, 1);
        }
        
        // Recharger les exercices disponibles pour mettre à jour la liste
        this.loadAvailableExercises();
        this.isLoadingExercises = false;
        return;
      }
      
      // Si l'exercice est lié, procéder à la désaffectation
      const url = `${this.baseUrl}/desafecterMultipleExercisesToSeance/${exerciseId}/${this.idSeance}`;
      
      // Configurer les headers
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*'
      });
      
      // Utiliser POST comme défini dans le backend
      this.http.post(url, {}, { 
        headers: headers,
        responseType: 'text'
      })
      .subscribe({
        next: (response) => {
          console.log(`Réponse du serveur:`, response);
          
          // Considérer la réponse comme un succès
          console.log(`Exercice ${exerciseId} retiré avec succès de la séance ${this.idSeance}`);
          this.successMessage = "Exercice retiré avec succès!";
          
          // Retirer l'exercice de la liste des sélectionnés si ce n'est pas déjà fait
          const index = this.selectedExercises.indexOf(exerciseId);
          if (index !== -1) {
            this.selectedExercises.splice(index, 1);
          }
          
          // Recharger les exercices disponibles pour mettre à jour la liste
          this.loadAvailableExercises();
          this.isLoadingExercises = false;
        },
        error: (err) => {
          console.error("Erreur détaillée lors du retrait de l'exercice:", err);
          
          // Vérifier si l'erreur est due au fait que l'exercice n'est pas lié à la séance
          if (err.error && typeof err.error === 'string' && 
              (err.error.includes("n'est pas lié") || err.error.includes("not linked"))) {
            console.log(`L'exercice ${exerciseId} n'est plus lié à la séance ${this.idSeance}. Mise à jour de l'interface.`);
            
            // Si l'exercice n'est pas lié, le retirer simplement de la liste des sélectionnés
            const index = this.selectedExercises.indexOf(exerciseId);
            if (index !== -1) {
              this.selectedExercises.splice(index, 1);
            }
            
            // Recharger les exercices disponibles pour mettre à jour la liste
            this.loadAvailableExercises();
            this.isLoadingExercises = false;
            return;
          }
          
          // Pour les autres erreurs, afficher un message d'erreur
          const errorMsg = this.extractErrorMessage(err);
          this.errorMessage = errorMsg;
          
          this.isLoadingExercises = false;
        }
      });
    },
    error: (err) => {
      console.error("Erreur lors de la vérification des exercices de la séance:", err);
      this.errorMessage = "Erreur lors de la vérification des exercices de la séance.";
      this.isLoadingExercises = false;
    }
  });
}

  // Méthode pour retirer plusieurs exercices à la fois
  removeSelectedExercises(): void {
    if (this.selectedExercises.length === 0) {
      this.errorMessage = "Aucun exercice sélectionné à retirer.";
      return;
    }

    // Confirmer avant de retirer les exercices
    this.showConfirmModal = true;
    this.confirmMessage = `Voulez-vous vraiment retirer ${this.selectedExercises.length} exercice(s) de cette séance?`;
    this.pendingSubmission = true;
    this.pendingAction = "removeExercises"; // Set the pending action type
  }

  // Méthode pour traiter la suppression de plusieurs exercices avec POST (corrigé)
  processRemoveExercises(): void {
    // Afficher l'état de chargement
    this.isLoadingExercises = true;
    
    // Effacer les messages précédents
    this.successMessage = "";
    this.errorMessage = "";
    
    // Créer une copie du tableau pour éviter la modification pendant l'itération
    const exercisesToRemove = [...this.selectedExercises];
    
    if (exercisesToRemove.length === 0) {
      this.errorMessage = "Aucun exercice sélectionné à retirer.";
      this.isLoadingExercises = false;
      return;
    }
  
    console.log(`Tentative de retrait de ${exercisesToRemove.length} exercices de la séance ${this.idSeance}`);
  
    // Vérifier d'abord quels exercices sont réellement liés à la séance
    this.service.findBySeanceExerciceIdSeance(this.idSeance).subscribe({
      next: (linkedExercises) => {
        // Filtrer pour ne garder que les exercices réellement liés
        const linkedExerciseIds = linkedExercises.map(ex => ex.idExercice);
        const actuallyLinkedExercises = exercisesToRemove.filter(id => linkedExerciseIds.includes(id));
        const notLinkedExercises = exercisesToRemove.filter(id => !linkedExerciseIds.includes(id));
        
        // Si certains exercices ne sont pas liés, les retirer simplement de la liste des sélectionnés
        if (notLinkedExercises.length > 0) {
          console.log(`${notLinkedExercises.length} exercices ne sont pas liés à la séance. Mise à jour de l'interface.`);
          
          notLinkedExercises.forEach(id => {
            const index = this.selectedExercises.indexOf(id);
            if (index !== -1) {
              this.selectedExercises.splice(index, 1);
            }
          });
        }
        
        // S'il n'y a pas d'exercices liés à retirer, terminer
        if (actuallyLinkedExercises.length === 0) {
          console.log("Aucun exercice lié à retirer.");
          this.successMessage = "Mise à jour terminée.";
          this.isLoadingExercises = false;
          this.loadAvailableExercises();
          return;
        }
        
        // Compteurs pour suivre la progression
        let completedCount = 0;
        let errorCount = 0;
        let successCount = 0;
  
        // Configurer les headers
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*'
        });
  
        // Traiter chaque exercice lié un par un
        const processNextExercise = (index: number) => {
          if (index >= actuallyLinkedExercises.length) {
            // Tous les exercices ont été traités
            this.isLoadingExercises = false;
            
            if (errorCount === 0) {
              this.successMessage = "Tous les exercices ont été retirés avec succès!";
            } else if (successCount > 0) {
              this.successMessage = `${successCount} exercices retirés. ${errorCount} erreurs.`;
            } else {
              this.errorMessage = `Erreur lors du retrait des exercices.`;
            }
            
            // Recharger les exercices
            this.loadExercises();
            this.loadAvailableExercises();
            return;
          }
          
          const exerciseId = actuallyLinkedExercises[index];
          const url = `${this.baseUrl}/desafecterMultipleExercisesToSeance/${exerciseId}/${this.idSeance}`;
          
          // Utiliser POST avec responseType: 'text'
          this.http.post(url, {}, { 
            headers: headers,
            responseType: 'text'
          })
          .subscribe({
            next: (response) => {
              console.log(`Exercice ${exerciseId} retiré avec succès`, response);
              successCount++;
              completedCount++;
              
              // Supprimer de l'array selectedExercises
              const selectedIndex = this.selectedExercises.indexOf(exerciseId);
              if (selectedIndex !== -1) {
                this.selectedExercises.splice(selectedIndex, 1);
              }
              
              // Passer à l'exercice suivant
              processNextExercise(index + 1);
            },
            error: (err) => {
              console.error(`Erreur détaillée lors du retrait de l'exercice ${exerciseId}:`, err);
              
              // Vérifier si l'erreur est due au fait que l'exercice n'est pas lié à la séance
              if (err.error && typeof err.error === 'string' && 
                  (err.error.includes("n'est pas lié") || err.error.includes("not linked"))) {
                console.log(`L'exercice ${exerciseId} n'est plus lié à la séance ${this.idSeance}. Mise à jour de l'interface.`);
                
                // Si l'exercice n'est pas lié, le retirer simplement de la liste des sélectionnés
                const index = this.selectedExercises.indexOf(exerciseId);
                if (index !== -1) {
                  this.selectedExercises.splice(index, 1);
                }
                
                // Compter comme un succès
                successCount++;
                completedCount++;
                
                // Passer à l'exercice suivant
                processNextExercise(index + 1);
                return;
              }
              
              // Pour les autres erreurs, incrémenter le compteur d'erreurs
              errorCount++;
              completedCount++;
              
              // Passer à l'exercice suivant même en cas d'erreur
              processNextExercise(index + 1);
            }
          });
        };
        
        // Démarrer le traitement avec le premier exercice
        processNextExercise(0);
      },
      error: (err) => {
        console.error("Erreur lors de la vérification des exercices de la séance:", err);
        this.errorMessage = "Erreur lors de la vérification des exercices de la séance.";
        this.isLoadingExercises = false;
      }
    });
    
    // Timeout de sécurité pour s'assurer que l'état de chargement est réinitialisé
    setTimeout(() => {
      if (this.isLoadingExercises) {
        this.isLoadingExercises = false;
        this.errorMessage = "Délai d'attente dépassé lors du retrait des exercices.";
        this.loadExercises();
        this.loadAvailableExercises();
      }
    }, 30000); // 30 secondes de timeout
  }

  // MODIFIÉ: Mettre à jour les exercices associés à la séance
  updateExercises(): void {
    if (this.selectedExercises.length > 0) {
      this.isLoadingExercises = true;
      
      // Avant d'affecter, recharger les exercices pour s'assurer que nous avons la liste à jour
      this.service.findBySeanceExerciceIdSeance(this.idSeance).subscribe({
        next: (currentExercises) => {
          // Obtenir les IDs des exercices actuellement affectés
          const currentExerciseIds = currentExercises.map(ex => ex.idExercice);
          
          // Trouver les nouveaux exercices à affecter (ceux qui sont dans selectedExercises mais pas dans currentExerciseIds)
          const exercisesToAdd = this.selectedExercises.filter(id => !currentExerciseIds.includes(id));
          
          if (exercisesToAdd.length > 0) {
            // N'affecter que les nouveaux exercices
            this.service.affecterExercisesASeance(this.idSeance, exercisesToAdd).subscribe({
              next: () => {
                console.log("Nouveaux exercices ajoutés avec succès");
                this.successMessage = "Exercices mis à jour avec succès!";
                // Recharger les exercices pour afficher les changements
                this.loadExercises();
                this.loadAvailableExercises();
              },
              error: (err) => {
                console.error("Erreur lors de l'ajout des nouveaux exercices", err);
                this.errorMessage = "Erreur lors de la mise à jour des exercices: " + this.extractErrorMessage(err);
                this.isLoadingExercises = false;
              }
            });
          } else {
            console.log("Aucun nouvel exercice à ajouter");
            this.successMessage = "Séance mise à jour avec succès!";
            this.isLoadingExercises = false;
          }
        },
        error: (err) => {
          console.error("Erreur lors de la vérification des exercices actuels", err);
          this.errorMessage = "Erreur lors de la mise à jour des exercices: " + this.extractErrorMessage(err);
          this.isLoadingExercises = false;
        }
      });
    } else {
      // Si aucun exercice n'est sélectionné, désaffecter tous les exercices
      this.processRemoveExercises();
    }
  }

  // Getters pour accéder facilement aux contrôles du formulaire
  get titleSeance() {
    return this.seanceform.get("titleSeance");
  }
  get typeSeance() {
    return this.seanceform.get("typeSeance");
  }
  get jourSeance() {
    return this.seanceform.get("jourSeance");
  }
  get heureDebut() {
    return this.seanceform.get("heureDebut");
  }
  get heureFin() {
    return this.seanceform.get("heureFin");
  }
  get durationMinutes() {
    return this.seanceform.get("durationMinutes");
  }
  get description() {
    return this.seanceform.get("description");
  }
  get location() {
    return this.seanceform.get("location");
  }
  get intensityLevel() {
    return this.seanceform.get("intensityLevel");
  }

  // Navigation entre les sections
  setCurrentSection(section: string): void {
    this.currentSection = section;
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

  getProgressPercentage(): number {
    const currentIndex = this.sections.indexOf(this.currentSection);
    return ((currentIndex + 1) / this.sections.length) * 100;
  }

  // Calculer la durée automatiquement
  calculateDuration(): void {
    const startTime = this.seanceform.get("heureDebut")?.value;
    const endTime = this.seanceform.get("heureFin")?.value;

    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);

      let diff = end.getTime() - start.getTime();
      if (diff < 0) {
        diff += 24 * 60 * 60 * 1000; // Add 24 hours
      }

      const durationMinutes = Math.round(diff / 60000);
      this.seanceform.get("durationMinutes")?.setValue(durationMinutes);
    }
  }

  // Nouvelles méthodes de validation
  isPastDate(): boolean {
    const selectedDate = this.seanceform.get("jourSeance")?.value;
    if (!selectedDate) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateToCheck = new Date(selectedDate);
    dateToCheck.setHours(0, 0, 0, 0);

    return dateToCheck < today;
  }

  isEndTimeBeforeStartTime(): boolean {
    const startTime = this.seanceform.get("heureDebut")?.value;
    const endTime = this.seanceform.get("heureFin")?.value;

    if (!startTime || !endTime) return false;

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    return end < start;
  }

  isDurationExcessive(): boolean {
    const duration = this.seanceform.get("durationMinutes")?.value;
    return duration > 120;
  }

  isHighIntensity(): boolean {
    const intensity = this.seanceform.get("intensityLevel")?.value;
    return intensity >= 8;
  }

  // Méthode pour valider et soumettre le formulaire
  validateAndSubmit(): void {
    if (this.seanceform.invalid) {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.seanceform.controls).forEach((key) => {
        this.seanceform.get(key)?.markAsTouched();
      });

      this.showValidationAlert = true;
      this.validationMessage = "Veuillez corriger les erreurs dans le formulaire avant de soumettre.";
      return;
    }

    // Vérifier les conditions qui nécessitent une confirmation
    if (this.isPastDate()) {
      this.showConfirmModal = true;
      this.confirmMessage = "Vous avez sélectionné une date passée. Voulez-vous vraiment continuer?";
      this.pendingSubmission = true;
      this.pendingAction = "updateSeance"; // Set the pending action type
      return;
    }

    if (this.isDurationExcessive()) {
      this.showConfirmModal = true;
      this.confirmMessage = "La durée de la séance est supérieure à 120 minutes. Voulez-vous vraiment continuer?";
      this.pendingSubmission = true;
      this.pendingAction = "updateSeance";
      return;
    }

    if (this.isHighIntensity()) {
      this.showConfirmModal = true;
      this.confirmMessage =
        "Le niveau d'intensité est élevé. Assurez-vous que les participants sont en bonne condition physique. Voulez-vous continuer?";
      this.pendingSubmission = true;
      this.pendingAction = "updateSeance";
      return;
    }

    if (this.selectedExercises.length > this.maxExercisesAllowed) {
      this.showConfirmModal = true;
      this.confirmMessage = `Vous avez sélectionné ${this.selectedExercises.length} exercices, ce qui dépasse la limite recommandée de ${this.maxExercisesAllowed} pour une séance de cette intensité et durée. Voulez-vous continuer?`;
      this.pendingSubmission = true;
      this.pendingAction = "updateSeance";
      return;
    }

    if (this.selectedExercises.length < 1) {
      this.showConfirmModal = true;
      this.confirmMessage = "Aucun exercice n'a été sélectionné. Voulez-vous vraiment continuer sans exercices?";
      this.pendingSubmission = true;
      this.pendingAction = "updateSeance";
      return;
    }

    // Si aucune condition ne nécessite de confirmation, soumettre directement
    this.updateSeance();
  }

  // Confirmer la soumission après l'alerte
  confirmSubmit(): void {
    this.showConfirmModal = false;

    // Check the type of pending action
    if (this.pendingAction === "removeExercises") {
      // Process removing exercises
      this.processRemoveExercises();
    } else {
      // Default is to update the seance
      this.updateSeance();
    }

    // Reset state
    this.pendingSubmission = false;
    this.pendingAction = "";
  }

  // Annuler la soumission
  cancelSubmit(): void {
    this.showConfirmModal = false;
    this.pendingSubmission = false;
    this.pendingAction = "";
  }

  // Fermer l'alerte de validation
  dismissAlert(): void {
    this.showValidationAlert = false;
  }

  // Méthode de mise à jour de la séance
  updateSeance() {
    if (this.seanceform.valid) {
      this.isLoadingExercises = true;
      
      // Récupérer les valeurs du formulaire, y compris les champs désactivés
      const formValue = { ...this.seanceform.getRawValue() };
      
      // Log pour déboguer les valeurs envoyées
      console.log("Valeurs du formulaire à envoyer:", formValue);
      
      // S'assurer que typeSeance et durationMinutes sont bien inclus
      if (!formValue.typeSeance) {
        formValue.typeSeance = this.seanceform.get("typeSeance")?.value;
        console.log("typeSeance ajouté manuellement:", formValue.typeSeance);
      }
      
      if (!formValue.durationMinutes) {
        formValue.durationMinutes = this.seanceform.get("durationMinutes")?.value;
        console.log("durationMinutes ajouté manuellement:", formValue.durationMinutes);
      }
      
      // Convertir les valeurs numériques si nécessaire
      formValue.durationMinutes = Number(formValue.durationMinutes);
      formValue.intensityLevel = Number(formValue.intensityLevel);
      
      // Log final des valeurs après correction
      console.log("Valeurs finales à envoyer:", formValue);
  
      this.service.updateSeances(this.idSeance, formValue).subscribe({
        next: (response) => {
          console.log("Réponse du serveur après mise à jour:", response);
          
          // Mettre à jour les exercices après avoir mis à jour la séance
          this.updateExercises();
  
          this.successMessage = "Séance mise à jour avec succès!";
          this.errorMessage = "";
  
          // Rediriger après un court délai
          setTimeout(() => {
            this.router.navigate(["coatch/showseance"]).then(() => {
              window.location.reload();
            });
          }, 2000);
        },
        error: (err) => {
          this.errorMessage = "Erreur lors de la mise à jour de la séance: " + this.extractErrorMessage(err);
          this.successMessage = "";
          console.error("Erreur détaillée lors de la mise à jour:", err);
          this.isLoadingExercises = false;
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.seanceform.controls).forEach((key) => {
        this.seanceform.get(key)?.markAsTouched();
      });
  
      this.errorMessage = "Veuillez corriger les erreurs dans le formulaire.";
    }
  }
}