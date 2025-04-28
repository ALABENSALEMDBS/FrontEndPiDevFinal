import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RapportService } from 'src/app/services/serviceAnalyste/gerer-rapport/rapport.service';

@Component({
  selector: 'app-update-rapport',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './update-rapport.component.html',
  styleUrls: ['./update-rapport.component.css']
})
export class UpdateRapportComponent implements OnInit {
  @Input() rapportData: any;
  sections: string[] = ["performance", "strength", "agility", "state"];
  currentSection = "performance";

  etatOptions = [
    "GOOD", "BAD"
  ];

  blessureOptions = [
    "None", "Minor", "Moderate", "Severe"
  ];

  idRapport: any;
  rapportForm!: FormGroup;

  constructor(private act: ActivatedRoute, private service: RapportService, private router: Router) {}

  ngOnInit(): void {
    this.idRapport = this.act.snapshot.params['idRapport'];

    this.rapportForm = new FormGroup({
      idRapport: new FormControl({ value: '', disabled: true }),
      speedRapport: this.createNumericControl(0, 100),
      accelerationRapport: this.createNumericControl(0, 100),
      endurance: this.createNumericControl(0, 100),
      muscularEndurance: this.createNumericControl(0, 100),
      aerobicCapacity: this.createNumericControl(0, 100),
      anaerobicCapacity: this.createNumericControl(0, 100),
      strength: this.createNumericControl(0, 100),
      power: this.createNumericControl(0, 100),
      explosiveness: this.createNumericControl(0, 100),
      verticalJump: this.createNumericControl(0, 100),
      horizontalJump: this.createNumericControl(0, 100),
      agility: this.createNumericControl(0, 100),
      balance: this.createNumericControl(0, 100),
      coordination: this.createNumericControl(0, 100),
      reactionTime: this.createNumericControl(0, 100),
      reactivity: this.createNumericControl(0, 100),
      etatRapport: new FormControl('', [Validators.required]),
      blessureRapport: new FormControl('', [Validators.required]),
    });

    this.service.getbyidRapport(this.rapportData.idRapport).subscribe((data) => {
      this.rapportForm.patchValue(data);
    });
  }

  private createNumericControl(min: number, max: number): FormControl {
    return new FormControl('', [
      Validators.required,
      Validators.min(min),
      Validators.max(max),
      Validators.pattern('^[0-9]+$') // Uniquement des chiffres
    ]);
  }

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

  get speedRapport() { return this.rapportForm.get('speedRapport'); }
  get accelerationRapport() { return this.rapportForm.get('accelerationRapport'); }
  get endurance() { return this.rapportForm.get('endurance'); }
  get muscularEndurance() { return this.rapportForm.get('muscularEndurance'); }
  get aerobicCapacity() { return this.rapportForm.get('aerobicCapacity'); }
  get anaerobicCapacity() { return this.rapportForm.get('anaerobicCapacity'); }
  get strength() { return this.rapportForm.get('strength'); }
  get power() { return this.rapportForm.get('power'); }
  get explosiveness() { return this.rapportForm.get('explosiveness'); }
  get verticalJump() { return this.rapportForm.get('verticalJump'); }
  get horizontalJump() { return this.rapportForm.get('horizontalJump'); }
  get agility() { return this.rapportForm.get('agility'); }
  get balance() { return this.rapportForm.get('balance'); }
  get coordination() { return this.rapportForm.get('coordination'); }
  get reactionTime() { return this.rapportForm.get('reactionTime'); }
  get reactivity() { return this.rapportForm.get('reactivity'); }
  get etatRapport() { return this.rapportForm.get('etatRapport'); }
  get blessureRapport() { return this.rapportForm.get('blessureRapport'); }

  getProgressPercentage(): number {
    const currentIndex = this.sections.indexOf(this.currentSection);
    return ((currentIndex + 1) / this.sections.length) * 100;
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
    }
  }

  updateRapport() {
    if (this.rapportForm.valid) {
      this.service.updateRapport(this.rapportData.idRapport, this.rapportForm.getRawValue()).subscribe(() => {
        this.rapportForm.reset();
        window.location.reload();
        this.router.navigate(['analyste/Reportshow']);
      });
    }
  }
}
