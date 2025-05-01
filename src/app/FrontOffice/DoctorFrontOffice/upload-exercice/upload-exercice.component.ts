import { Component } from '@angular/core';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';

@Component({
  selector: 'app-upload-exercice',
  imports: [],
  templateUrl: './upload-exercice.component.html',
  styleUrl: './upload-exercice.component.css'
})
export class UploadExerciceComponent {
  selectedFile!: File;
constructor(
   
    private servijoueurServiceced: ServiceDoctorService,
  ) { }

onFileSelected(event: any): void {
  this.selectedFile = event.target.files[0];
}

onUpload(): void {
  if (this.selectedFile) {
    this.servijoueurServiceced.uploadExerciceFile(this.selectedFile).subscribe({
      next: (res) => alert('Fichier importé avec succès !'),
      error: (err) => alert('Erreur : ' + err.error)
    });
  } else {
    alert('Aucun fichier sélectionné.');
  }

}}
