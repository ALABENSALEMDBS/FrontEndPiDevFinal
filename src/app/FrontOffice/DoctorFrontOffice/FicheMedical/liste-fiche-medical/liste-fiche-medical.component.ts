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
           // alert('Exercice supprimé avec succès !');
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
      const now = new Date();
    
      // Header background
      doc.setFillColor(0, 102, 204);
      doc.rect(0, 0, 210, 30, 'F');
    
      // Logo image (replace with your actual path or base64)
      // Exemple avec logo local dans assets : Angular : mettre le logo dans src/assets
      doc.addImage('assets/images/b2.png', 'PNG', 10, 5, 20, 20);
    
      // App name with emoji
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.text(' Tactic Foot - Medical Records ', 105, 15, { align: 'center' });
    
      // Exported on date
      doc.setFontSize(10);
      doc.text(`Exported on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 105, 24, { align: 'center' });
    
      // Table setup
      const columns = ['Player', 'Weight (kg)', 'Height (cm)', 'Injury Date', 'Severity', 'Injury Type'];
      const data = this.fichesMedicales.map(fiche => [
        fiche.joueurFullName,
        fiche.poidsFicheMedicale,
        fiche.tailleFicheMedicale,
        fiche.dateBlessure,
        fiche.gravite,
        fiche.type,
      ]);
    
      autoTable(doc, {
        head: [columns],
        body: data,
        theme: 'striped',
        startY: 35,
        styles: {
          fontSize: 10,
          cellPadding: 3,
          valign: 'middle',
          halign: 'center',
          lineColor: [204, 204, 204],
        },
        headStyles: {
          fillColor: [0, 102, 204],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        margin: { top: 30, left: 14, right: 14 },
        didDrawPage: (data) => {
          const pageHeight = doc.internal.pageSize.height;
          doc.setFontSize(9);
          doc.setTextColor(120);
    
          // Footer
          doc.text('Tactic Foot • All Rights Reserved • Confidential', 105, pageHeight - 10, { align: 'center' });
        }
      });
    
      // Save the document
      doc.save(`medical_records_${now.toISOString().slice(0, 10)}.pdf`);
    }
    
    //selected 
    selectedFiche: any = null;
    detailsVisible: boolean = false;
    
    selectPlayer(fiche: any) {
      this.selectedFiche = fiche;
      this.detailsVisible = true;
    }
    
    toggleDetails() {
      this.detailsVisible = !this.detailsVisible;
    }
    

    
  }
