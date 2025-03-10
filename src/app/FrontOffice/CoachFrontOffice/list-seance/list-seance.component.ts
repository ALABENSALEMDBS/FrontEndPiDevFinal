import { Component, OnInit } from '@angular/core';
import { SeanceService } from 'src/app/services/serviceCoatch/serviceSeance/seance.service';
import { seance } from 'src/core/models/seance';
import { SeanceCalenderComponent } from '../seance-calender/seance-calender.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
// Import the SeanceCalenderComponent

@Component({
  selector: 'app-list-seance',
  imports : [RouterLink,RouterOutlet,CommonModule,SeanceCalenderComponent],
  templateUrl: './list-seance.component.html',
  styleUrls: ['./list-seance.component.css'],
  standalone: true
})
export class ListSeanceComponent implements OnInit {
  seance: seance[] = [];
  isCalendarPanelOpen = false;
  selectedSeance: seance | null = null;

  constructor(private SeanceService: SeanceService) {}

  ngOnInit(): void {
    this.SeanceService.getAllSeances().subscribe((data) => {
      this.seance = data;
    });
  }

  deleteseance(id: number): void {
    this.SeanceService.delSeances(id).subscribe(() => {
      console.log("deleted exercices !!!!");
      window.location.reload();
    });
  }

  // Updated to specifically handle calendar panel
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
}