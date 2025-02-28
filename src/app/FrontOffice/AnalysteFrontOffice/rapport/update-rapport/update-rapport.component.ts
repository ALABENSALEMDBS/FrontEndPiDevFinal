import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RapportService } from 'src/app/services/serviceAnalyste/gerer-rapport/rapport.service';

@Component({
  selector: 'app-update-rapport',
  templateUrl: './update-rapport.component.html',
  styleUrls: ['./update-rapport.component.css']
})
export class UpdateRapportComponent implements OnInit {
  @Input() rapportData: any; 

  idRapport: any;
  rapportForm!: FormGroup;

  constructor(private act: ActivatedRoute, private service: RapportService, private router: Router) { }

  ngOnInit(): void {
    this.idRapport = this.act.snapshot.params['idRapport'];

    // Initialisation correcte du formulaire sans `titleSeance` et `jourSeance`
    this.rapportForm = new FormGroup({
      idRapport: new FormControl({ value: '', disabled: true }),
      speedRapport: new FormControl('', [Validators.required]),
      accelerationRapport: new FormControl('', [Validators.required]),
      endurance: new FormControl('', [Validators.required]),
      muscularEndurance: new FormControl('', [Validators.required]),
      aerobicCapacity: new FormControl('', [Validators.required]),
      anaerobicCapacity: new FormControl('', [Validators.required]),
      strength: new FormControl('', [Validators.required]),
      power: new FormControl('', [Validators.required]),
      explosiveness: new FormControl('', [Validators.required]),
      verticalJump: new FormControl('', [Validators.required]),
      horizontalJump: new FormControl('', [Validators.required]),
      agility: new FormControl('', [Validators.required]),
      balance: new FormControl('', [Validators.required]),
      coordination: new FormControl('', [Validators.required]),
      reactionTime: new FormControl('', [Validators.required]),
      reactivity: new FormControl('', [Validators.required]),
      etatRapport: new FormControl('', [Validators.required]),
      blessureRapport: new FormControl('', [Validators.required]),
    });

    // Charger les données du rapport à modifier
    this.service.getbyidRapport(this.idRapport).subscribe((data) => {
      this.rapportForm.patchValue(data);
    });
  }

  updateRapport() {
    if (this.rapportForm.valid) {
      this.service.updateRapport(this.idRapport, this.rapportForm.value).subscribe(() => {
        this.rapportForm.reset();
        this.router.navigate(['analyste/Reportshow']);
      });
    }
  }
}
