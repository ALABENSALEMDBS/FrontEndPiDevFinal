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
      doc.setFontSize(18);
      doc.text('Medical Records List', 105, 15, { align: 'center' });
    
      // Subtitle with export date
      doc.setFontSize(11);
      const now = new Date();
      doc.text(`Exported on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 105, 22, { align: 'center' });
    
      // Define table columns and data
      const columns = ['Player', 'Weight (kg)', 'Height (cm)', 'Injury Date', 'Severity', 'Injury Type'];
      const data = this.fichesMedicales.map(fiche => [
        fiche.joueurFullName,
        fiche.poidsFicheMedicale,
        fiche.tailleFicheMedicale,
        //this.datePipe.transform(fiche.dateBlessure, 'dd/MM/yyyy') ?? '', // Formatted date
        fiche.gravite,
        fiche.type,
      ]);
    
      // Add Table
      autoTable(doc, {
        head: [columns],
        body: data,
        theme: 'striped',
        startY: 30,
        styles: {
          fontSize: 10,
          cellPadding: 3,
          valign: 'middle',
          halign: 'center',
          lineColor: [204, 204, 204], // Line color between rows
        },
        headStyles: {
          fillColor: [0, 102, 204], // Blue header
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240], // Light gray for better readability
        },
        columnStyles: {
          0: { cellWidth: 45 }, // Player
          1: { cellWidth: 25 }, // Weight
          2: { cellWidth: 25 }, // Height
          3: { cellWidth: 35 }, // Date
          4: { cellWidth: 30 }, // Severity
          5: { cellWidth: 30 }, // Type
        },
        margin: { top: 25, left: 14, right: 14 },
        didDrawPage: (data) => {
          // Footer with page number
          const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
          doc.setFontSize(10);
    
          // Optional: Add logo or watermark in the footer
          // doc.addImage('path_to_logo.png', 'PNG', 180, pageHeight - 20, 20, 10);
        }
      });
    
      // Optional: Add a header at the bottom for additional information
      doc.setFontSize(8);
      doc.text('Confidential - For internal use only', 105, 290, { align: 'center' });
    
      // Save the PDF
      doc.save(`medical_records_${now.toISOString().slice(0,10)}.pdf`);
    }
    
  }
