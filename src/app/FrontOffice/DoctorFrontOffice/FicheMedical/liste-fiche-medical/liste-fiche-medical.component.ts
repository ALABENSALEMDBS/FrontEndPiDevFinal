import { query } from '@angular/animations';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceDoctorService } from 'src/app/services/service-doctor.service';
import { FicheMedical } from 'src/core/models/ficheMedical';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-liste-fiche-medical',
  templateUrl: './liste-fiche-medical.component.html',
  styleUrls: ['./liste-fiche-medical.component.css'],
  standalone: false
})
export class ListeFicheMedicalComponent {
  fichesMedicales: any[] = [];
  errorMessage = '';
  viewMode: 'table' | 'cards' = 'table';
  searchName: string = '';
  constructor(private servicedoctors: ServiceDoctorService , private router :Router) {}
  

  // Méthode appelée lors de la saisie dans le champ de recherche
  onSearch(): void {
    // Filtrer les fiches médicales en fonction du nom
    this.filteredFiches = this.fichesMedicales.filter(fiche =>
      fiche.joueurFullName.toLowerCase().includes(this.searchName.toLowerCase())
    );
  }

  // Liste filtrée des fiches médicales
  filteredFiches: any[] = [];
  
  ngOnInit(): void {
    this.loadFichesMedicales();
  }

  loadFichesMedicales(): void {
    this.servicedoctors.getFichesMedicales().subscribe({
      next: (data) => {
        this.fichesMedicales = data;
        this.filteredFiches = data; // 🔥 Mets à jour ici une fois les données chargées
      },
      error: (err) => this.errorMessage = 'Erreur de chargement des données.'
    });
  }
  onUpdateFicheMedicaleClicked(fm: FicheMedical): void {
    this.router.navigate(['doctor/update-fiche-player'], { queryParams: { id: fm.idFicheMedicale } })
  }

   supprimerficheMedical(fiche: FicheMedical): void {
      if (confirm("Do you really want to delete this Medical Record ?")) {
        this.servicedoctors.deletfichemedicalbyid(fiche.idFicheMedicale).subscribe({
          next: () => {
            alert('Exercice supprimé avec succès !');
            this.loadFichesMedicales(); // Mettre à jour la liste
          },
          error: (err) => {
            console.error('Erreur lors de la suppression :', err);
            alert('Erreur lors de la suppression de l’exercice.');
          }
        });
      }
    }
    exportToPDF(): void {
      const doc = new jsPDF();
    
      // Title Section
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text('Medical Records List', 14, 10);
    
      // Define table columns and data
      const columns = ['Player', 'Weight (kg)', 'Height (cm)', 'Injury Date', 'Severity', 'Injury Type'];
      const data = this.fichesMedicales.map(fiche => [
        fiche.joueurFullName,
        fiche.poidsFicheMedicale,
        fiche.tailleFicheMedicale,
       // this.datePipe.transform(fiche.dateBlessure, 'dd/MM/yyyy'),  // Format the date
        fiche.gravite,
        fiche.type,
      ]);
    
      // Use autoTable to generate a better formatted table
      autoTable(doc, {
        head: [columns],
        body: data,
        theme: 'striped', // Add striping to rows for better readability
        startY: 30, // Adjust the starting Y position to leave space for the title
        styles: {
          fontSize: 10, // Font size for table content
          cellPadding: 2, // Padding inside each cell
        },
        headStyles: {
          fillColor: [40, 40, 40], // Dark background for header
          textColor: [255, 255, 255], // White text in header
        },
        columnStyles: {
          0: { cellWidth: 50 }, // Custom column width for player name
          1: { cellWidth: 30 }, // Custom column width for weight
          2: { cellWidth: 30 }, // Custom column width for height
          3: { cellWidth: 40 }, // Custom column width for injury date
          4: { cellWidth: 30 }, // Custom column width for severity
          5: { cellWidth: 30 }, // Custom column width for injury type
        },
        margin: { top: 20, left: 14 }, // Adjust margin
      });
    
      // Save the PDF file
      doc.save('medical_records.pdf');
    }
  }
