import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchService } from '../../../../services/serviceSuperAdmin/servicegerermatch/match.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-updatematch',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-match.component.html',
  styleUrls: ['./update-match.component.css'],
  //standalone: true
})
export class UpdateMatchComponent implements OnInit {
  @Input() matchData: any;  // Input to receive the match data

  idMatch: any;
  matchForm!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  teams: string[] = ['Team A', 'Team B', 'Team C', 'Team D']; // List of teams

  constructor(private act: ActivatedRoute, private matchService: MatchService, private router: Router) { }

  ngOnInit(): void {
    this.idMatch = this.act.snapshot.params['idMatch'];

    // Initialize form group
    this.matchForm = new FormGroup({
      idMatch: new FormControl({ value: '', disabled: true }),  // Disable the id field
      resultatMatch: new FormControl('', [Validators.required]),
      dateMatch: new FormControl('', [Validators.required]),
      lieuMatch: new FormControl('', [Validators.required]),
      statusMatch: new FormControl('', [Validators.required]),
      typeMatch: new FormControl('', [Validators.required]),
      arbitre: new FormControl('', [Validators.required]),
      equipe1: new FormControl('', [Validators.required]),
      equipe2: new FormControl('', [Validators.required]),
    });

    // Load match data to edit
    this.matchService.getbyidMatchs(this.matchData.idMatch).subscribe((data) => {
      this.matchForm.patchValue(data);  // Populate the form with match data
    });
  }

  // Getter methods for form controls
  get resultatMatch() {
    return this.matchForm.get('resultatMatch');
  }

  get dateMatch() {
    return this.matchForm.get('dateMatch');
  }

  get lieuMatch() {
    return this.matchForm.get('lieuMatch');
  }

  get statusMatch() {
    return this.matchForm.get('statusMatch');
  }

  get typeMatch() {
    return this.matchForm.get('typeMatch');
  }

  get arbitre() {
    return this.matchForm.get('arbitre');
  }

  get equipe1() {
    return this.matchForm.get('equipe1');
  }

  get equipe2() {
    return this.matchForm.get('equipe2');
  }

  updateMatch() {
    if (this.matchForm.valid) {
      this.matchService.updateMatchs(this.matchData.idMatch, this.matchForm.value).subscribe({
        next: () => {
          this.successMessage = 'Match mis à jour avec succès !';
          this.errorMessage = '';
          this.matchForm.reset();
          this.router.navigate(['/list-match']);
        },
        error: () => {
          this.errorMessage = 'Erreur lors de la mise à jour du match.';
          this.successMessage = '';
        }
      });
    }
  }
}