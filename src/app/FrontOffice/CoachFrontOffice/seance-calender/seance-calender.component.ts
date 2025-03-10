import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { seance } from 'src/core/models/seance';
import { SeanceService } from 'src/app/services/serviceCoatch/serviceSeance/seance.service';

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
  
  constructor(
    private seanceService: SeanceService,
    private fb: FormBuilder
  ) {
    this.seanceForm = this.fb.group({
      idSeance: [null],
      titleSeance: ['', Validators.required],
      jourSeance: ['', Validators.required],
      heureDebut: ['', Validators.required],
      heureFin: ['', Validators.required],
      typeSeance: ['', Validators.required],
      description: [''],
      location: ['', Validators.required],
      durationMinutes: [60, [Validators.required, Validators.min(1)]],
      intensityLevel: [3, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
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
    
    // Show the seance details modal if there are seances on this day
    if (day.seances.length > 0) {
      this.showSeanceDetails = true;
      
      // Set the first seance as the selected one (for backward compatibility)
      const idSeance = day.seances[0].idSeance;
      
      this.seanceService.getbyidSeances(idSeance).subscribe(
        (data) => {
          this.seance = Array.isArray(data) ? data[0] : data;
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
      },
      (error) => {
        console.error("Error fetching seance details:", error);
      }
    );
  }
  
  // Method to close the seance details modal
  closeSeanceDetails() {
    this.showSeanceDetails = false;
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
  {
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
}