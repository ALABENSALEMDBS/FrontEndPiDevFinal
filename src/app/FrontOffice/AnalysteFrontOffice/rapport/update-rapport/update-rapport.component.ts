import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RapportService } from 'src/app/services/serviceAnalyste/gerer-rapport/rapport.service';

@Component({
  selector: 'app-update-rapport',
  imports: [ReactiveFormsModule,CommonModule],
  
  templateUrl: './update-rapport.component.html',
  styleUrls: ['./update-rapport.component.css']
})
export class UpdateRapportComponent implements OnInit {
  @Input() rapportData: any; 
  sections: string[] = ["performance", "strength", "agility", "state"]
  currentSection = "performance"


  etatOptions = [
    "good","bad"
  ];

  blessureOptions = [
    "None","Minor","Moderate","Severe"
  ];
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
    this.service.getbyidRapport(this.rapportData.idRapport).subscribe((data) => {
      this.rapportForm.patchValue(data);
    });
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

  // Move to the previous section
  prevSection(): void {
    const currentIndex = this.sections.indexOf(this.currentSection)
    if (currentIndex > 0) {
      this.currentSection = this.sections[currentIndex - 1]
    }
  }
  get speedRapport() { return this.rapportForm.get('speedRapport'); }
  get accelerationRapport() { return this.rapportForm.get('accelerationRapport'); }
  get endurance() { return this.rapportForm.get('endurance'); }
  get muscularEndurance() { return this.rapportForm.get('muscularEndurance'); }
  get aerobicCapacity() { return this.rapportForm.get('aerobicCapacity'); }
  get anaerobicCapacity() { return this.rapportForm.get('anaerobicCapacity'); }
  get strength() { return this.rapportForm.get('strength'); }
  get power() { return this.rapportForm.get('power'); }
  get explosiveness() { return this.rapportForm.get('explosiveness'); }
  get agility() { return this.rapportForm.get('agility'); }
  get balance() { return this.rapportForm.get('balance'); }
  get coordination() { return this.rapportForm.get('coordination'); }
  get reactionTime() { return this.rapportForm.get('reactionTime'); }
  get reactivity() { return this.rapportForm.get('reactivity'); }
  get verticalJump() { return this.rapportForm.get('verticalJump'); }
  get horizontalJump() { return this.rapportForm.get('horizontalJump'); }
  get etatRapport() { return this.rapportForm.get('etatRapport'); }
  get blessureRapport() { return this.rapportForm.get('blessureRapport'); }
  // Calculate progress percentage
  getProgressPercentage(): number {
    const currentIndex = this.sections.indexOf(this.currentSection)
    return ((currentIndex + 1) / this.sections.length) * 100
  }

  updateRapport() {
    if (this.rapportForm.valid) {
      this.service.updateRapport(this.rapportData.idRapport, this.rapportForm.value).subscribe(() => {
        this.rapportForm.reset();
        this.router.navigate(['analyste/Reportshow']);
      });
    }
  }
}
