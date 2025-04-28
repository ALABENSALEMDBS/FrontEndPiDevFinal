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
    events: [],  // Initially empty, will be populated via loadConsultations
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay',
    },
    editable: true,
    droppable: true,
    eventDrop: (info) => this.handleEventDrop(info),
    dateClick: (dateInfo) => this.onDateClick(dateInfo),
    eventClick: (eventInfo) => this.onEventClick(eventInfo)
  };

  clickedDate: string | null = null;
  formVisible = false;
  consultationForm!: FormGroup;
  joueurs: Joueur[] = [];
  isLoading = false;
  allConsultations: Consultation[] = [];
  selectedConsultation: Consultation | null = null;
  errorMessage: string | null = null; 

  constructor(
    private service: ServiceDoctorService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    // Initialize the form group for consultation
    this.consultationForm = this.fb.group({
      dateConsultation: ['', Validators.required],
      idUser: ['', Validators.required],
      description: ['', [Validators.required, Validators.maxLength(255)]]
      
    });



    // Fetch all players (joueurs) from the service
    this.service.getalljoueur().subscribe(data => {
      this.joueurs = data.sort((a, b) => a.nameUsers.localeCompare(b.nameUsers));
    }, error => {
      console.error('Error fetching players', error);
      alert('Erreur lors de la récupération des joueurs');
    });
        // Load consultations
    this.loadConsultations(); 
  }

  // When a date is clicked in the calendar
  onDateClick(dateInfo: any) {
    this.clickedDate = dateInfo.dateStr;
    this.formVisible = true;
    this.consultationForm.patchValue({ dateConsultation: this.clickedDate });
  }

  // Load consultations from the service
  loadConsultations() {
    this.service.getAllConsultations().subscribe(
      (consultations) => {
        console.log('Consultations récupérées:', consultations); // Log to check the data
        this.allConsultations = consultations;
        this.updateCalendarEvents(); // Populate events after fetching consultations
      },
      (error) => {
        console.error('Erreur lors du chargement des consultations', error);
        alert('Erreur de chargement des consultations');
      }
    );
  }

  // Helper function to get the player name by ID
  getJoueurName(id: number | null): string {
    if (!id) {
      return 'Inconnu'; // Handle null or undefined id
    }
    const joueur = this.joueurs.find(j => j.idUser === id);
    return joueur ? joueur.nameUsers  : 'Inconnu'; // If no player found, return "Inconnu"
  }

  // Handle form submission (for creating or updating a consultation)
  onSubmit(): void {
    if (this.consultationForm.invalid) return;
  
    const formValue = this.consultationForm.value;
    const consultationDate = new Date(formValue.dateConsultation);
    
    // Vérification si une consultation existe déjà à la même date
    const isDateTaken = this.allConsultations.some(consultation => {
      // Comparaison des dates sans tenir compte de l'heure
      return new Date(consultation.dateConsultation).toDateString() === consultationDate.toDateString();
    });
  
    if (isDateTaken) {
      alert('La date sélectionnée est déjà occupée par une autre consultation.');
      return; // Empêche l'ajout si la date est déjà prise
    }
  
    this.isLoading = true;
    const consultation: Consultation = {
      dateConsultation: consultationDate,
      description: formValue.description,
      idUser: formValue.idUser
    };
  
    if (this.selectedConsultation) {
      // Mise à jour
      consultation.id = this.selectedConsultation.id;
      this.service.updateConsultation(consultation).subscribe(
        () => {
          this.isLoading = false;
          alert('Consultation mise à jour !');
          this.resetForm();
          this.updateCalendarEvent(consultation);
        },
        (error) => {
          this.isLoading = false;
          console.error('Erreur lors de la mise à jour de la consultation', error);
          this.showErrorMessage('Erreur lors de la mise à jour de la consultation.');
        }
      );
    } else {
      // Ajout
      const idn = consultation.idUser; // ID du joueur
      this.service.addConsultation(consultation, idn).subscribe(
        (newConsultation) => {
          this.isLoading = false;
          alert('Consultation ajoutée !');
          this.allConsultations.push(newConsultation);
          this.addCalendarEvent(newConsultation); // Ajoute à l'affichage du calendrier
          this.resetForm();
        },
        (error) => {
          this.isLoading = false;
          console.error('Erreur lors de l\'ajout de la consultation', error);
          this.showErrorMessage('Erreur lors de l\'ajout de la consultation.');
        }
      );
    }
  }
  

  // Display error messages
  showErrorMessage(message: string) {
    this.errorMessage = message;
  }

  // Reset the form
  resetForm() {
    this.consultationForm.reset();
    this.formVisible = false;
    this.selectedConsultation = null;
  }

  // Update the calendar event after modification
  updateCalendarEvent(consultation: Consultation) {
    const calendarApi = this.calendarComponent.getApi();

    console.log('i am hereé', consultation);

    const event = calendarApi.getEventById(consultation.id?.toString() || '');
    if (event) {
      event.setProp('title', `${this.getJoueurName(consultation.idUser)} - ${consultation.description}`);
      event.setStart(consultation.dateConsultation);
    } else {
      console.error('Événement introuvable pour la mise à jour :', consultation.id);
    }
  }

  // Add a new event to the calendar
  addCalendarEvent(newConsultation: Consultation) {
    const calendarApi = this.calendarComponent.getApi();
    console.log('i am hereé', newConsultation);
    calendarApi.addEvent({
      id: newConsultation.id ? newConsultation.id.toString() : '',
      title: `${this.getJoueurName(newConsultation.idUser)} - ${newConsultation.description}`,
      date: newConsultation.dateConsultation,
      backgroundColor: '#28a745',
      borderColor: '#1e7e34',
      textColor: 'white'
    });
  }

  // Handle event drag (when a user changes the date of an event)
  handleEventDrop(info: any): void {
    const movedEvent = info.event;
    const newDate = movedEvent.startStr;

    const consultationId = Number(movedEvent.id); // Ensure event ID is treated as a number
    const original = this.allConsultations.find(c => c.id === consultationId);

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

  // When an event is clicked on the calendar
  onEventClick(eventInfo: any) {
    const consultationId = Number(eventInfo.event.id);
    const consultation = this.allConsultations.find(c => c.id === consultationId);
  
    if (consultation) {
      this.selectedConsultation = consultation;
      this.formVisible = true;
  
      const date = new Date(consultation.dateConsultation);
  
      // Décalage entre UTC et Local
      const timezoneOffset = date.getTimezoneOffset() * 60000; // en millisecondes
      const localISOTime = new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
  
      this.consultationForm.patchValue({
        dateConsultation: localISOTime,
        idUser: consultation.idUser,
        description: consultation.description,
      });
    }
  }
  
  

  // Update events in the calendar after loading consultations
  updateCalendarEvents() {
    const calendarApi = this.calendarComponent.getApi();
    this.calendarOptions.events = this.allConsultations.map(c => ({
      id: c.id?.toString() || '',
      title: `${this.getJoueurName(c.idUser)}- ${c.description}`,
      date: c.dateConsultation,
      backgroundColor: '#28a745',
      borderColor: '#1e7e34',
      textColor: 'white'
    }));
  }
  
}
