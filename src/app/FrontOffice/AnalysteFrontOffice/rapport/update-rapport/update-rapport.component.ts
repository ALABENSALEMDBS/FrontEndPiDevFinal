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
  isLoading = true;
  
  // Add validation messages
  validationMessages = {
    required: 'This field is required',
    min: 'Value must be at least 0',
    max: 'Value must be at most 100',
    pattern: 'Only numbers are allowed'
  };

  constructor(private act: ActivatedRoute, private service: RapportService, private router: Router) {}

  ngOnInit(): void {
    // Initialize the form first
    this.initializeForm();
    
    // Get the ID either from route params or from input data
    if (this.act.snapshot.params['idRapport']) {
      // Get ID from route parameter
      this.idRapport = this.act.snapshot.params['idRapport'];
      this.loadRapportData(this.idRapport);
    } else if (this.rapportData && this.rapportData.idRapport) {
      // Get ID from input data
      this.idRapport = this.rapportData.idRapport;
      this.loadRapportData(this.idRapport);
    } else {
      console.error('No rapport ID provided');
      this.isLoading = false;
      // Optionally navigate back or show an error
      // this.router.navigate(['analyste/Reportshow']);
    }
  }

  private initializeForm(): void {
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
    });
  }

  private loadRapportData(id: number): void {
    this.isLoading = true;
    this.service.getbyidRapport(id).subscribe(
      (data) => {
        if (data) {
          this.rapportForm.patchValue(data);
        } else {
          console.error('No data returned for rapport ID:', id);
        }
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading rapport data:', error);
        this.isLoading = false;
      }
    );
  }

  private createNumericControl(min: number, max: number): FormControl {
    return new FormControl('', [
      Validators.required,
      Validators.min(min),
      Validators.max(max),
      Validators.pattern('^[0-9]+$') // Only numbers
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

  // Enhanced getters with validation error methods
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

  // New method to get validation error message
  getErrorMessage(controlName: string): string {
    const control = this.rapportForm.get(controlName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) return this.validationMessages.required;
      if (control.errors['min']) return this.validationMessages.min;
      if (control.errors['max']) return this.validationMessages.max;
      if (control.errors['pattern']) return this.validationMessages.pattern;
    }
    return '';
  }

  // New method to check if a field has a specific error
  hasError(controlName: string, errorType: string): boolean {
    const control = this.rapportForm.get(controlName);
    return control && control.touched && control.errors && control.errors[errorType] ? true : false;
  }

  getProgressPercentage(): number {
    const currentIndex = this.sections.indexOf(this.currentSection);
    return ((currentIndex + 1) / this.sections.length) * 100;
  }

  // Enhanced input validation
  allowOnlyNumbers(event: KeyboardEvent) {
    // Allow: backspace, delete, tab, escape, enter
    if ([46, 8, 9, 27, 13].indexOf(event.keyCode) !== -1 ||
        // Allow: Ctrl+A
        (event.keyCode === 65 && event.ctrlKey === true) ||
        // Allow: Ctrl+C
        (event.keyCode === 67 && event.ctrlKey === true) ||
        // Allow: Ctrl+V
        (event.keyCode === 86 && event.ctrlKey === true) ||
        // Allow: Ctrl+X
        (event.keyCode === 88 && event.ctrlKey === true) ||
        // Allow: home, end, left, right
        (event.keyCode >= 35 && event.keyCode <= 39)) {
      return;
    }
    
    // Ensure that it is a number and stop the keypress
    if ((event.shiftKey || (event.keyCode < 48 || event.keyCode > 57)) && 
        (event.keyCode < 96 || event.keyCode > 105)) {
      event.preventDefault();
    }
  }

  // Method to validate input value on blur
  validateInputValue(event: FocusEvent, min: number = 0, max: number = 100) {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value);
    
    if (isNaN(value)) {
      input.value = min.toString();
    } else if (value < min) {
      input.value = min.toString();
    } else if (value > max) {
      input.value = max.toString();
    }
    
    // Update form control value
    const controlName = input.getAttribute('formControlName');
    if (controlName) {
      this.rapportForm.get(controlName)?.setValue(input.value);
    }
  }

  // Check if section is valid
  isSectionValid(section: string): boolean {
    const sectionControls: { [key: string]: string[] } = {
      'performance': ['speedRapport', 'accelerationRapport', 'endurance'],
      'strength': ['muscularEndurance', 'aerobicCapacity', 'anaerobicCapacity', 'strength', 'power', 'explosiveness'],
      'agility': ['agility', 'balance', 'coordination', 'reactionTime', 'reactivity', 'verticalJump', 'horizontalJump'],
      'state': ['etatRapport']
    };
    
    return sectionControls[section].every(control => 
      this.rapportForm.get(control)?.valid || !this.rapportForm.get(control)?.touched
    );
  }

  // Method to close the form and navigate back
  closeForm(): void {
    // Navigate back to the reports list
    this.router.navigate(['analyste/Reportshow']);
  }
  updateRapport() {
    // Mark all fields as touched to trigger validation
    Object.keys(this.rapportForm.controls).forEach(key => {
      const control = this.rapportForm.get(key);
      control?.markAsTouched();
    });
  
    if (this.rapportForm.valid) {
      this.service.updateRapport(this.idRapport, this.rapportForm.getRawValue()).subscribe(
        () => {
          // First reset the form
          this.rapportForm.reset();
          
          // Then navigate back to the reports list
          this.router.navigate(['analyste/Reportshow']).then(() => {
            // Only reload the page after navigation is complete
            window.location.reload();
          });
        },
        (error) => {
          console.error('Error updating rapport:', error);
        }
      );
    } else {
      // Find the first section with invalid controls and navigate to it
      for (const section of this.sections) {
        if (!this.isSectionValid(section)) {
          this.currentSection = section;
          break;
        }
      }
    }
  }
}