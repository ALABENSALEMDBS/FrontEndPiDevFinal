import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { Joueur } from 'src/core/models/Joueurs';
import { Consultation } from 'src/core/models/Consultation';
import '@fullcalendar/interaction';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-calander-doctor',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, ReactiveFormsModule, FormsModule],
  templateUrl: './calander-doctor.component.html',
  styleUrls: ['./calander-doctor.component.css']
})
export class CalanderDoctorComponent {
  @ViewChild('calendarRef') calendarComponent!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [],
    editable: true,
    droppable: true,
    eventDrop: (info) => this.handleEventDrop(info),
    dateClick: (dateInfo) => this.onDateClick(dateInfo),
  };

  clickedDate: string | null = null;
  formVisible = false;
  consultationForm!: FormGroup;
  joueurs: Joueur[] = [];
  isLoading = false;
  allConsultations: Consultation[] = [];

  constructor(
    private service: ServiceDoctorService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.consultationForm = this.fb.group({
      dateConsultation: ['', Validators.required],
      idUser: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(255)]]
    });

    this.loadConsultations();

    this.service.getalljoueur().subscribe(data => {
      this.joueurs = data.sort((a, b) => a.nameUsers.localeCompare(b.nameUsers));
    });
  }

  onDateClick(dateInfo: any) {
    this.clickedDate = dateInfo.dateStr;
    this.formVisible = true;
    this.consultationForm.patchValue({ dateConsultation: this.clickedDate });
  }

  loadConsultations() {
    this.service.getAllConsultations().subscribe(
      (consultations) => {
        this.allConsultations = consultations;

        this.calendarOptions.events = consultations.map(c => ({
          id: c.id?.toString(),
          title: `${c.joueurFullName} - ${c.description}`,
          date: c.dateConsultation,
          backgroundColor: '#28a745',
          borderColor: '#1e7e34',
          textColor: 'white'
        }));
      },
      (error) => {
        console.error('Erreur lors du chargement des consultations', error);
        alert('Erreur de chargement des consultations');
      }
    );
  }

  getJoueurName(id: number): string {
    const joueur = this.joueurs.find(j => j.idUser === id);
    return joueur ? joueur.nameUsers : 'Inconnu';
  }

  onSubmit(): void {
    if (this.consultationForm.invalid) return;

    this.isLoading = true;
    const formValue = this.consultationForm.value;
    const consultation: Consultation = {
      dateConsultation: new Date(formValue.dateConsultation),
      description: formValue.description,
      idUser: formValue.idUser
    };

    this.service.addConsultation(consultation).subscribe((newConsultation) => {
      this.isLoading = false;
      alert('Consultation ajoutée !');
      this.consultationForm.reset();
      this.formVisible = false;

      const calendarApi = this.calendarComponent.getApi();
      calendarApi.addEvent({
        id: newConsultation.id?.toString(),
        title: `${this.getJoueurName(newConsultation.idUser)} - ${newConsultation.description}`,
        date: newConsultation.dateConsultation,
        backgroundColor: '#28a745',
        borderColor: '#1e7e34',
        textColor: 'white'
      });
    });
  }

  handleEventDrop(info: any): void {
    const movedEvent = info.event;
    const newDate = movedEvent.startStr;

    const consultationId = Number(movedEvent.id);
    const original = this.allConsultations.find(c => c.id=== consultationId);

    if (!original) {
      console.error('Consultation introuvable pour mise à jour');
      return;
    }

    const updatedConsultation: Consultation = {
      id: original.id,
      idUser: original.idUser,
      description: original.description,
      dateConsultation: new Date(newDate)
    };

    this.service.updateConsultation(updatedConsultation).subscribe(() => {
      alert('Consultation mise à jour avec succès!');
    }, () => {
      alert("Erreur lors de la mise à jour.");
    });
  }
  
}
