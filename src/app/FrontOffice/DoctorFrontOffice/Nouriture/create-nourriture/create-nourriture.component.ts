import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';
import { Nouriture } from 'src/core/models/nouriture';

@Component({
  selector: 'app-create-nourriture',
  templateUrl: './create-nourriture.component.html',
  styleUrls: ['./create-nourriture.component.css'],
  standalone: false
})
export class CreateNourritureComponent {

  nourritureForm: FormGroup;
  message: string = '';

  constructor(private fb: FormBuilder, private nouritureService: ServiceDoctorService) {
    this.nourritureForm = this.fb.group({
      nom: ['', [Validators.required, Validators.minLength(3)]],
      recommandation: ['', [Validators.required, Validators.minLength(5)]],
      calories: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ajouterNourriture() {
    if (this.nourritureForm.valid) {
      const nouvelleNourriture: Nouriture = this.nourritureForm.value;
      this.nouritureService.addnouriture(nouvelleNourriture).subscribe({
        next: (data) => {
          this.message = 'Nourriture ajoutée avec succès !';
          this.nourritureForm.reset();
          
        },
        error: (err) => {
          this.message = 'Erreur lors de l’ajout de la nourriture.';
          console.error(err);
        }
      });
    }
  }

}
