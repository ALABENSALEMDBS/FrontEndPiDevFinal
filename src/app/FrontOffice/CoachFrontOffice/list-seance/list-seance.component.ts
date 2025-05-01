// list-seance.component.ts
import { Component, OnInit } from '@angular/core';
import { SeanceService } from 'src/app/services/serviceCoatch/serviceSeance/seance.service';
import { seance } from 'src/core/models/seance';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AffectsessionexerciceComponent } from '../affectsessionexercice/affectsessionexercice.component';
import { SeanceCalenderComponent } from '../seance-calender/seance-calender.component';
import { ExerciceService } from 'src/app/services/serviceCoatch/serviceExercice/exercice.service';
import { Exercices } from 'src/core/models/exercice';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-list-seance',
  imports: [RouterLink, RouterOutlet, CommonModule, SeanceCalenderComponent, AffectsessionexerciceComponent],
  templateUrl: './list-seance.component.html',
  styleUrls: ['./list-seance.component.css'],
  standalone: true
})
export class ListSeanceComponent implements OnInit {
  seances: seance[] = [];
  seanceExercises: Map<number, Exercices[]> = new Map();
  isCalendarPanelOpen = false;
  selectedSeance: seance | null = null;
  loading = true;
  error = false;
  
  // Modal state
  isExerciseModalOpen = false;
  selectedSeanceForExercises: seance | null = null;
  
  // Track open exercise dropdowns
  openExerciseDropdowns: Set<number> = new Set();

  constructor(
    private seanceService: SeanceService,
    private exerciceService: ExerciceService
  ) {}

  ngOnInit(): void {
    this.loadSeances();
  }

  loadSeances(): void {
    this.loading = true;
    this.error = false;
    
    this.seanceService.getAllSeances().subscribe({
      next: (data) => {
        this.seances = data;
        this.loadExercisesForSeances();
      },
      error: (err) => {
        console.error('Error loading seances:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadExercisesForSeances(): void {
    if (this.seances.length === 0) {
      this.loading = false;
      return;
    }

    const exerciseObservables = this.seances.map(seance => 
      this.seanceService.findBySeanceExerciceIdSeance(seance.idSeance).pipe(
        catchError(error => {
          console.error(`Error loading exercises for seance ${seance.idSeance}:`, error);
          return of([] as Exercices[]);
        })
      )
    );

    forkJoin(exerciseObservables).subscribe({
      next: (exercisesArray) => {
        this.seances.forEach((seance, index) => {
          this.seanceExercises.set(seance.idSeance, exercisesArray[index]);
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading exercises:', err);
        this.loading = false;
      }
    });
  }

  getExercisesForSeance(seanceId: number): Exercices[] {
    return this.seanceExercises.get(seanceId) || [];
  }

  // Calculate max exercises based on intensity and duration
  getMaxExercises(seance: seance): number {
    const isLongSession = seance.durationMinutes > 45;
    
    // High intensity (8-10)
    if (seance.intensityLevel >= 8) {
      return isLongSession ? 10 : 7;
    }
    // Medium intensity (5-7)
    else if (seance.intensityLevel >= 5) {
      return isLongSession ? 7 : 5;
    }
    // Low intensity (1-4)
    else {
      return isLongSession ? 5 : 3;
    }
  }

  // Get intensity level category
  getIntensityCategory(level: number): string {
    if (level >= 8) return 'High';
    if (level >= 5) return 'Medium';
    return 'Low';
  }
  
  // Toggle exercise dropdown
  toggleExerciseDropdown(seanceId: number): void {
    if (this.openExerciseDropdowns.has(seanceId)) {
      this.openExerciseDropdowns.delete(seanceId);
    } else {
      this.openExerciseDropdowns.add(seanceId);
    }
  }
  
  // Check if exercise dropdown is open
  isExerciseDropdownOpen(seanceId: number): boolean {
    return this.openExerciseDropdowns.has(seanceId);
  }

  deleteseance(id: number): void {
    if (confirm('Are you sure you want to delete this seance?')) {
      this.seanceService.delSeances(id).subscribe({
        next: () => {
          console.log("Deleted seance successfully!");
          this.loadSeances();
        },
        error: (err) => {
          console.error('Error deleting seance:', err);
        }
      });
    }
  }

  toggleCalendarPanel(): void {
    this.isCalendarPanelOpen = !this.isCalendarPanelOpen;
  }

  openCalendarPanel(seance?: seance): void {
    this.isCalendarPanelOpen = true;
    this.selectedSeance = seance || null;
  }

  closeCalendarPanel(): void {
    this.isCalendarPanelOpen = false;
  }
  
  openExerciseModal(seance: seance): void {
    this.selectedSeanceForExercises = seance;
    this.isExerciseModalOpen = true;
  }
  
  closeExerciseModal(): void {
    this.isExerciseModalOpen = false;
    if (this.selectedSeanceForExercises) {
      const seanceId = this.selectedSeanceForExercises.idSeance;
      this.seanceService.findBySeanceExerciceIdSeance(seanceId).subscribe({
        next: (exercises) => {
          this.seanceExercises.set(seanceId, exercises);
        },
        error: (err) => {
          console.error(`Error reloading exercises for seance ${seanceId}:`, err);
        }
      });
    }
  }
}