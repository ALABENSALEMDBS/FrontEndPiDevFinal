import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { seance } from 'src/core/models/seance';
import { SeanceService } from 'src/app/services/serviceCoatch/serviceSeance/seance.service';
import { Exercices } from 'src/core/models/exercice';
import { RapportService } from 'src/app/services/serviceAnalyste/gerer-rapport/rapport.service';

@Component({
  selector: 'app-seance-calender',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './seance-calender.component.html',
  styleUrls: ['./seance-calender.component.css']
})
export class SeanceCalenderComponent implements OnInit {
  @Input() seance: seance | null = null;
  
  currentDate = new Date();
  currentMonth: string = '';
  currentYear: number = 0;
  calendarDays: any[] = [];
  upcomingSeances: seance[] = [];
  allSeances: seance[] = [];
  selectedDaySeances: seance[] = []; // New property to store all seances for the selected day
  showConfirmPopup = false;
  seanceIdToDelete: number | null = null;
  // Form management
  seanceForm: FormGroup;
  isEditing: boolean = false;
  showForm: boolean = false;
  showSeanceDetails: boolean = false; // New property to control the visibility of seance details
  
  // New properties for exercises
  seanceExercises: Exercices[] = [];
  loadingExercises: boolean = false;
  
  constructor(
    private rapportservice: RapportService,

    private seanceService: SeanceService,
    private fb: FormBuilder
  ) {
    this.seanceForm = this.fb.group({
      idSeance: [null],
      titleSeance: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
        Validators.pattern(/^[\w\sÀ-ÿ'-]+$/)  // Lettres, chiffres, accents, espaces
      ]],
      jourSeance: ['', [Validators.required, this.dateNotInPastValidator()]],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      typeSeance: ['', Validators.required],
      description: ['', [
        Validators.maxLength(300),
        this.noHtmlTagsValidator()
      ]],
      location: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[\w\sÀ-ÿ,'-]+$/) // Lettres, chiffres, virgule, apostrophe
      ]],
      durationMinutes: [60, [
        Validators.required,
        Validators.min(5),
        Validators.max(300)
      ]],
      intensityLevel: [3, [
        Validators.required,
        Validators.min(1),
        Validators.max(5)
      ]]
    }, {
      validators: [this.timeOrderValidator()]
    });
  }
  
  // Heure fin après heure début
  timeOrderValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const start = group.get('heureDebut')?.value;
      const end = group.get('heureFin')?.value;
      if (!start || !end) return null;
      const startTime = new Date(`1970-01-01T${start}`);
      const endTime = new Date(`1970-01-01T${end}`);
      return endTime > startTime ? null : { invalidTimeOrder: true };
    };
  }
  
  // Date ne doit pas être passée
  dateNotInPastValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const date = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today ? null : { dateInPast: true };
    };
  }
  
  // Description : Pas de balises HTML
  noHtmlTagsValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value && /<[^>]*>/.test(value)
        ? { containsHtml: true }
        : null;
    };
  }
  
  ngOnInit() {
    this.setCurrentMonthAndYear();
    this.loadSeances();
  }
  
  setCurrentMonthAndYear() {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    this.currentMonth = months[this.currentDate.getMonth()];
    this.currentYear = this.currentDate.getFullYear();
  }
  
  loadSeances() {
    this.seanceService.getAllSeances().subscribe(
      (data) => {
        this.allSeances = data;
        this.generateCalendarWithSeances();
        this.findUpcomingSeances();
      },
      (error) => {
        console.error('Error fetching seances:', error);
      }
    );
  }
  
  generateCalendarWithSeances() {
    // Create a calendar grid with actual seance data
    this.calendarDays = [];
    
    // Get the number of days in the current month
    const daysInMonth = new Date(this.currentYear, this.currentDate.getMonth() + 1, 0).getDate();
    
    // Get the day of the week the month starts on (0 = Sunday, 1 = Monday, etc.)
    const firstDay = new Date(this.currentYear, this.currentDate.getMonth(), 1).getDay();
    
    // Add empty cells for days before the start of the month
    for (let i = 0; i < firstDay; i++) {
      const prevMonthDate = new Date(this.currentYear, this.currentDate.getMonth(), -i);
      this.calendarDays.push({
        date: prevMonthDate,
        isCurrentMonth: false,
        isToday: this.isToday(prevMonthDate),
        hasSeance: this.hasSeanceOnDate(prevMonthDate),
        isSelected: false,
        seances: this.getSeancesForDate(prevMonthDate)
      });
    }
    
    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(this.currentYear, this.currentDate.getMonth(), i);
      
      this.calendarDays.push({
        date: date,
        isCurrentMonth: true,
        isToday: this.isToday(date),
        hasSeance: this.hasSeanceOnDate(date),
        isSelected: false,
        seances: this.getSeancesForDate(date)
      });
    }
    
    // Fill the remaining cells of the grid (if needed)
    const totalCells = 42; // 6 rows of 7 days
    const remainingCells = totalCells - this.calendarDays.length;
    
    for (let i = 1; i <= remainingCells; i++) {
      const nextMonthDate = new Date(this.currentYear, this.currentDate.getMonth() + 1, i);
      this.calendarDays.push({
        date: nextMonthDate,
        isCurrentMonth: false,
        isToday: this.isToday(nextMonthDate),
        hasSeance: this.hasSeanceOnDate(nextMonthDate),
        isSelected: false,
        seances: this.getSeancesForDate(nextMonthDate)
      });
    }
  }
  
  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  }
  
  hasSeanceOnDate(date: Date): boolean {
    return this.getSeancesForDate(date).length > 0;
  }
  
  getSeancesForDate(date: Date): seance[] {
    // Filter seances that occur on the given date
    return this.allSeances.filter(seance => {
      // Convert the seance date string to a Date object
      // Assuming jourSeance is in format 'YYYY-MM-DD'
      const seanceDate = new Date(seance.jourSeance);
      
      return seanceDate.getDate() === date.getDate() && 
             seanceDate.getMonth() === date.getMonth() && 
             seanceDate.getFullYear() === date.getFullYear();
    });
  }
  selectedExercise: Exercices | null = null;
exerciseSubgroups: any[] = [];
loadingSubgroups: boolean = false;
showSubgroupsModal: boolean = false;
 
  
  // Add this method to close the subgroups modal
  closeSubgroupsModal() {
    this.showSubgroupsModal = false;
    this.selectedExercise = null;
    this.exerciseSubgroups = [];
  }
  
  findUpcomingSeances() {
    const today = new Date();
    
    // Filter seances that are upcoming (today or in the future)
    this.upcomingSeances = this.allSeances
      .filter(seance => {
        const seanceDate = new Date(seance.jourSeance);
        return seanceDate >= today;
      })
      .sort((a, b) => {
        // Sort by date (ascending)
        return new Date(a.jourSeance).getTime() - new Date(b.jourSeance).getTime();
      })
      .slice(0, 5); // Get only the next 5 upcoming seances
  }
  
  previousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.setCurrentMonthAndYear();
    this.generateCalendarWithSeances();
  }
  
  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.setCurrentMonthAndYear();
    this.generateCalendarWithSeances();
  }
  
  selectDay(day: any) {
    this.calendarDays.forEach(d => d.isSelected = false);
    day.isSelected = true;
    
    // Store all seances for the selected day
    this.selectedDaySeances = day.seances;
    
    // Reset exercises
    this.seanceExercises = [];
    
    // Show the seance details modal if there are seances on this day
    if (day.seances.length > 0) {
      this.showSeanceDetails = true;
      
      // Set the first seance as the selected one (for backward compatibility)
      const idSeance = day.seances[0].idSeance;
      
      this.seanceService.getbyidSeances(idSeance).subscribe(
        (data) => {
          this.seance = Array.isArray(data) ? data[0] : data;
          // Load exercises for this seance
          this.loadExercisesForSeance(idSeance);
        },
        (error) => {
          console.error("Error fetching seance details:", error);
        }
      );
    } else {
      this.seance = null;
      this.showSeanceDetails = false;
    }
  }
  
  // Method to select a specific seance from the day's seances
  selectSeance(seanceId: number) {
    this.seanceService.getbyidSeances(seanceId).subscribe(
      (data) => {
        this.seance = Array.isArray(data) ? data[0] : data;
        // Load exercises for this seance
        this.loadExercisesForSeance(seanceId);
      },
      (error) => {
        console.error("Error fetching seance details:", error);
      }
    );
  }
  
  // New method to load exercises for a seance
  loadExercisesForSeance(seanceId: number) {
    this.loadingExercises = true;
    this.seanceExercises = [];
    
    this.seanceService.findBySeanceExerciceIdSeance(seanceId).subscribe(
      (exercises) => {
        this.seanceExercises = exercises;
        this.loadingExercises = false;
      },
      (error) => {
        console.error("Error fetching exercises:", error);
        this.loadingExercises = false;
      }
    );
  }
  
  // Method to close the seance details modal
  closeSeanceDetails() {
    this.showSeanceDetails = false;
    this.seanceExercises = [];
  }
  
  formatDateForInput(date: Date): string {
    // Format date as YYYY-MM-DD for input[type="date"]
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  addToPersonalCalendar() {
    alert('Feature not implemented: Add to calendar');
  }
  
  shareSeance() {
    alert('Feature not implemented: Share seance');
  }
  
  // CRUD Operations
  
  openAddForm() {
    this.isEditing = false;
    this.showForm = true;
    this.seanceForm.reset();
    
    // Pre-fill with today's date if no day is selected
    if (!this.calendarDays.some(day => day.isSelected)) {
      this.seanceForm.patchValue({
        jourSeance: this.formatDateForInput(new Date()),
        durationMinutes: 60,
        intensityLevel: 3
      });
    } else {
      // Pre-fill with the selected date
      const selectedDay = this.calendarDays.find(day => day.isSelected);
      if (selectedDay) {
        this.seanceForm.patchValue({
          jourSeance: this.formatDateForInput(selectedDay.date),
          durationMinutes: 60,
          intensityLevel: 3
        });
      }
    }
  }
  
  openEditForm(seance: seance) {
    this.isEditing = true;
    this.showForm = true;
    this.seanceForm.patchValue({
      idSeance: seance.idSeance,
      titleSeance: seance.titleSeance,
      jourSeance: seance.jourSeance,
      heureDebut: seance.heureDebut,
      heureFin: seance.heureFin,
      typeSeance: seance.typeSeance,
      description: seance.description,
      location: seance.location,
      durationMinutes: seance.durationMinutes,
      intensityLevel: seance.intensityLevel
    });
  }
  
  closeForm() {
    this.showForm = false;
    this.seanceForm.reset();
  }
  
  submitForm() {
    if (this.seanceForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.seanceForm.controls).forEach(key => {
        const control = this.seanceForm.get(key);
        control?.markAsTouched();
      });
      return;
    }
    
    const seanceData = this.seanceForm.value as seance;
    
    if (this.isEditing) {
      // Update existing seance
      const id = seanceData.idSeance;
      this.seanceService.updateSeances(id, seanceData).subscribe(
        () => {
          this.loadSeances();
          this.closeForm();
          window.location.reload();
        },
        (error) => {
          console.error('Error updating seance:', error);
          alert('Failed to update seance. Please try again.');
        }
      );
    } else {
      // Add new seance
      this.seanceService.addSeances(seanceData).subscribe(
        () => {
          this.loadSeances();
          this.closeForm();
          window.location.reload();
        },
        (error) => {
          console.error('Error adding seance:', error);
          alert('Failed to add seance. Please try again.');
        }
      );
    }
  }
  // Add this method to your component class to load players for subgroups
// Add these methods to your SeanceCalenderComponent class

// Method to load players for a specific subgroup
// Add these methods to your SeanceCalenderComponent class

// Method to load players for a specific subgroup
loadPlayersForSubgroup(nameSousGroup: string) {
  // Find the subgroup in our array
  const subgroupIndex = this.exerciseSubgroups.findIndex(subgroup => subgroup.nameSousGroup === nameSousGroup);
  if (subgroupIndex !== -1) {
    // Set loading state
    this.exerciseSubgroups[subgroupIndex].loadingPlayers = true;
    
    // Call the service to get players for this subgroup
    this.rapportservice.findJoueursBynameSousGroup(nameSousGroup).subscribe(
      (players) => {
        // Update the subgroup with players data
        this.exerciseSubgroups[subgroupIndex].joueurs = players;
        this.exerciseSubgroups[subgroupIndex].loadingPlayers = false;
      },
      (error) => {
        console.error(`Error fetching players for subgroup ${nameSousGroup}:`, error);
        this.exerciseSubgroups[subgroupIndex].loadingPlayers = false;
      }
    );
  }
}

// Modify the loadSousGroupesForExercise method to load players for each subgroup
loadSousGroupesForExercise(exerciseId: number) {
  this.loadingSubgroups = true;
  this.selectedExercise = this.seanceExercises.find(ex => ex.idExercice === exerciseId) || null;
  this.showSubgroupsModal = true;
  
  this.seanceService.findSousGroupesidExercice(exerciseId).subscribe(
    (subgroups) => {
      // Initialize subgroups with loading state for players
      this.exerciseSubgroups = subgroups.map((subgroup: any) => ({
        ...subgroup,
        joueurs: [],
        loadingPlayers: true
      }));
      this.loadingSubgroups = false;
      
      // For each subgroup, load its players
      if (this.exerciseSubgroups.length > 0) {
        this.exerciseSubgroups.forEach(subgroup => {
          this.loadPlayersForSubgroup(subgroup.nameSousGroup);
        });
      }
    },
    (error) => {
      console.error('Error fetching subgroups:', error);
      this.loadingSubgroups = false;
    }
  );
}

// Method to load all subgroups for a session and their players
loadSubgroupsForSession(titleSeance: string) {
  this.rapportservice.findSousGroupestitleSeance(titleSeance).subscribe(
    (subgroups) => {
      // Initialize subgroups with loading state for players
      this.exerciseSubgroups = subgroups.map((subgroup: any) => ({
        ...subgroup,
        joueurs: [],
        loadingPlayers: true
      }));
      
      // For each subgroup, load its players
      if (this.exerciseSubgroups.length > 0) {
        this.exerciseSubgroups.forEach(subgroup => {
          this.loadPlayersForSubgroup(subgroup.nameSousGroup);
        });
      }
    },
    (error) => {
      console.error('Error fetching subgroups for session:', error);
    }
  );
}

// New method to load players for all subgroups
loadPlayersForSubgroups(exerciseId: number) {
  this.seanceService.findSousGroupesJoueurs(exerciseId).subscribe(
    (data) => {
      if (Array.isArray(data)) {
        // Update our subgroups with player data
        this.exerciseSubgroups = this.exerciseSubgroups.map(subgroup => {
          // Find the matching subgroup in the response
          const subgroupWithPlayers = data.find(item => item.idSousGroup === subgroup.idSousGroup);
          if (subgroupWithPlayers && subgroupWithPlayers.joueurs) {
            subgroup.joueurs = subgroupWithPlayers.joueurs;
          }
          return subgroup;
        });
      }
    },
    (error) => {
      console.error('Error fetching players for subgroups:', error);
    }
  );
}
  openConfirmPopup(id: number) {
    this.seanceIdToDelete = id;
    this.showConfirmPopup = true;
  }

  closeConfirmPopup() {
    this.showConfirmPopup = false;
    this.seanceIdToDelete = null;
  }

  // Confirmer la suppression d'un rapport
  confirmDelete() {
    if (this.seanceIdToDelete !== null) {
      this.deleteSeance(this.seanceIdToDelete);
      this.closeConfirmPopup();
    }
  }
  
  deleteSeance(id: number) {
    this.seanceService.delSeances(id).subscribe(
      () => {
        this.loadSeances();
        this.seance = null;
        this.showSeanceDetails = false;
        window.location.reload();
      },
      (error) => {
        console.error('Error deleting seance:', error);
        alert('Failed to delete seance. Please try again.');
      }
    );
  }
}