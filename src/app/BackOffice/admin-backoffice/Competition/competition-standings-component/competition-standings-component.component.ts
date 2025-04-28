import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CompetitionService } from 'src/app/services/serviceCompetition/competition.service';

import { ReactiveFormsModule } from '@angular/forms';
import { Competition } from 'src/core/models/competition';
import { Standing } from 'src/core/models/Standing';

@Component({
  selector: 'app-competition-standings',
  standalone: true,
  templateUrl: './competition-standings-component.component.html',
  styleUrls: ['./competition-standings-component.component.css'],
  imports: [CommonModule, RouterModule,ReactiveFormsModule],
})
export class CompetitionStandingsComponent implements OnInit {
  competitionId!: number;
  competition!: Competition;
  standings: Standing[] = [];
  loading = true;
  error = '';
  successMessage = '';

  constructor(
    private competitionService: CompetitionService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.competitionId = +this.route.snapshot.paramMap.get('id')!;
    this.loadCompetition();
    this.loadStandings();
  }

  loadCompetition(): void {
    this.competitionService.getCompetitionById(this.competitionId).subscribe({
      next: (data) => {
        this.competition = data;
      },
      error: (err) => {
        this.error = 'Failed to load competition details.';
        console.error(err);
      },
    });
  }

  loadStandings(): void {
    this.loading = true;
    this.competitionService.getStandings(this.competitionId).subscribe({
      next: (data) => {
        // Filter standings for this competition only
        this.standings = data.filter((standing) => standing.competition?.idCompetition === this.competitionId);

        // Sort standings by points (descending), then goal difference
        this.standings.sort((a, b) => {
          if (b.points !== a.points) {
            return b.points - a.points;
          }
          return b.goalDifference - a.goalDifference;
        });

        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load standings. Please try again.';
        console.error(err);
        this.loading = false;
      },
    });
  }

  updateStandings(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.competitionService.generateStandings(this.competitionId).subscribe({
      next: () => {
        this.successMessage = 'Standings updated successfully!';
        this.loadStandings(); // Reload standings after update
      },
      error: (err) => {
        this.error = 'Failed to update standings. Please try again.';
        console.error(err);
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}