import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';
import { Consultation } from 'src/core/models/Consultation';
import { Joueur } from 'src/core/models/Joueurs';

@Component({
  selector: 'app-add-consultation',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-consultation.component.html',
  styleUrl: './add-consultation.component.css'
})
export class AddConsultationComponent {
  consultationForm!: FormGroup;
  joueurs: Joueur[] = [];

  constructor(private fb: FormBuilder, private service: ServiceDoctorService) {}

  ngOnInit(): void {
    this.consultationForm = this.fb.group({
      dateConsultation: ['', Validators.required],
      joueurId: ['', Validators.required],
      description: ['']
    });

    this.service.getalljoueur().subscribe(data => this.joueurs = data);
  }

  // onSubmit(): void {
  //   const formValue = this.consultationForm.value;

  //   const consultation: Consultation = {
  //     dateConsultation: new Date(formValue.dateConsultation),
  //     description: formValue.description,
  //     idUser: formValue.joueurId,
  //   };

  //   this.service.addConsultation(consultation).subscribe(() => {
  //     alert('Consultation ajoutée avec succès !');
  //     this.consultationForm.reset();
  //   });
  // }

}
