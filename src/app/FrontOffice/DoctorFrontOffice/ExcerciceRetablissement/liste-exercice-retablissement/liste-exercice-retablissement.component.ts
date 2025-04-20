import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';
import { ExerciceRetablissements } from 'src/core/models/ExerciceRetablissement';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-liste-exercice-retablissement',
  templateUrl: './liste-exercice-retablissement.component.html',
  styleUrls: ['./liste-exercice-retablissement.component.css'],
  standalone: false
})
export class ListeExerciceRetablissementComponent {
  selectedDescription: string = '';
  filteredExercices = [];
viewMode: string = 'table'; 
  exercices: ExerciceRetablissements[] = [];

  constructor(private exerciceService: ServiceDoctorService , private router:Router) {}
  ngOnInit(): void {
    this.getExercices();
  }

  getExercices(): void {
    this.exerciceService.getAllExercices().subscribe({
      next: (data) => {
        this.exercices = data;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des exercices :', err);
      }
    });
  }
  goToCreatePage(): void {
    this.router.navigate(['doctor/creationexerciceRetab']);
  }


  supprimerExercice(exercice: ExerciceRetablissements): void {
    if (confirm("Do you really want to delete this exercise?")) {
      this.exerciceService.deletexercicebyid(exercice.idExerciceRetablissement).subscribe({
        next: () => {
          //alert('Exercice supprimé avec succès !');
          this.getExercices(); // Mettre à jour la liste
        },
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
          alert('Erreur lors de la suppression de l’exercice.');
        }
      });
    }

  
  }
  openModal(exercice: any): void {
    this.selectedDescription = exercice.descriptionExerciceRetablissement;
    // Ici, ajoutez le code pour ouvrir un modal si nécessaire (par exemple avec Angular Material ou Bootstrap)
    console.log('Ouverture du modal avec la description :', this.selectedDescription);
  }
//export

// exportToPDF(): void {
//   const doc = new jsPDF();

//   // Title Section
//   doc.setFont('helvetica', 'bold');
//   doc.setFontSize(20);
//   doc.text('List of Recovery Exercises', 14, 10);

//   // Define table columns and data
//   const columns = ['Name', 'Description', 'Duration (min)', 'Level'];
//   const data = this.exercices.map(exercice => [
//     exercice.nomExerciceRetablissement,
//     exercice.descriptionExerciceRetablissement,
//     exercice.dureeExercice ? exercice.dureeExercice : 'Not Specified',
//     exercice.niveauDifficulte ? exercice.niveauDifficulte : 'Not Specified',
//   ]);

//   // Add table with autoTable
//   autoTable(doc, {
//     head: [columns],
//     body: data,
//     startY: 20, // Start after title
//     theme: 'grid',
//     styles: { fontSize: 10 },
//     headStyles: { fillColor: [40, 40, 40] },
//     margin: { top: 10, left: 10, right: 10 },
//   });

//   // Save the PDF file
//   doc.save('recovery_exercises.pdf');
// }

exportToPDF(): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Palette de couleurs
  const primaryColor: [number, number, number] = [33, 150, 243];
  const secondaryColor: [number, number, number] = [240, 240, 240];
  const headerColor: [number, number, number] = [25, 118, 210];
  const whiteColor: [number, number, number] = [255, 255, 255];
  const greyText: [number, number, number] = [80, 80, 80];

  // Bandeau haut simulé avec plusieurs rectangles pour créer un dégradé
  const gradientSteps = 10;  // Nombre de segments pour simuler le dégradé
  const gradientHeight = 30;
  for (let i = 0; i < gradientSteps; i++) {
    const r = primaryColor[0] + (secondaryColor[0] - primaryColor[0]) * (i / gradientSteps);
    const g = primaryColor[1] + (secondaryColor[1] - primaryColor[1]) * (i / gradientSteps);
    const b = primaryColor[2] + (secondaryColor[2] - primaryColor[2]) * (i / gradientSteps);
    doc.setFillColor(r, g, b);
    doc.rect(0, i * (gradientHeight / gradientSteps), pageWidth, gradientHeight / gradientSteps, 'F');
  }

  // Titre de l'application (SportClub)
  const appTitle = 'SportClub';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20); // Taille plus grande pour le titre de l'application
  doc.setTextColor(...whiteColor);
  const appTitleX = (pageWidth - doc.getTextWidth(appTitle)) / 2;
  doc.text(appTitle, appTitleX, 18); // Positionnement ajusté pour une meilleure hiérarchie

  // Titre du rapport
  const reportTitle = 'Recovery Exercises Report';
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  const titleX = (pageWidth - doc.getTextWidth(reportTitle)) / 2;
  doc.text(reportTitle, titleX, 26);

  // Date sous le bandeau
  const exportDate = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...greyText);
  doc.text(`Export Date: ${exportDate}`, pageWidth - 50, 38);

  // Tableau stylé
  const columns = ['Name', 'Description', 'Duration (min)', 'Level'];
  const data = this.exercices.map(exercice => [
    exercice.nomExerciceRetablissement,
    exercice.descriptionExerciceRetablissement,
    exercice.dureeExercice ?? 'Not Specified',
    exercice.niveauDifficulte ?? 'Not Specified',
  ]);

  autoTable(doc, {
    head: [columns],
    body: data,
    startY: 45,
    theme: 'striped',
    styles: {
      fontSize: 10,
      cellPadding: 6, // Augmenté pour plus d'espace
      halign: 'left',
      textColor: [60, 60, 60],
      lineWidth: 0.5, // Lignes de tableau plus fines
      lineColor: [200, 200, 200], // Couleur subtile des lignes
    },
    headStyles: {
      fillColor: headerColor,
      textColor: whiteColor,
      fontStyle: 'bold',
      fontSize: 12, // Taille légèrement plus grande pour l'en-tête
    },
    alternateRowStyles: {
      fillColor: secondaryColor,
    },
    margin: { top: 10, left: 10, right: 10 },
    didDrawPage: function () {
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageNumber = doc.getNumberOfPages();

      // Ligne décorative en bas
      doc.setDrawColor(200);
      doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);

      // Pied de page : ajout de texte centré et du numéro de page
      doc.setFontSize(9);
      doc.setTextColor(...greyText);
      doc.text('Contact us: contact@recoveryapp.tn | +216 12 345 678', 10, pageHeight - 10);
      doc.text(`Page ${pageNumber}`, pageWidth - 30, pageHeight - 10);
    }
  });

  doc.save('recovery_exercises.pdf');
}



//upload
selectedFile!: File;

onFileSelected(event: any): void {
  this.selectedFile = event.target.files[0];
}

onUpload(): void {
  if (this.selectedFile) {
    this.exerciceService.uploadExerciceFile(this.selectedFile).subscribe({
      next: (res) => alert('Fichier importé avec succès !'),
      error: (err) => alert('Erreur : ' + err.error)
    });
  } else {
    alert('Aucun fichier sélectionné.');
  }

}
//upload essay




}
