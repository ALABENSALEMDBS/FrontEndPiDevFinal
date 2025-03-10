import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { Joueurs } from 'src/core/models/joueur';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-player-rapport-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-rapport-details.component.html',
  styleUrl: './player-rapport-details.component.css'
})
export class PlayerRapportDetailsComponent {
  @Input() joueur: Joueurs | null = null;
  @ViewChild('playerPanel') playerPanel!: ElementRef; // Référence à l'élément HTML

  ngOnChanges() {
    console.log("Données reçues par le composant joueur :", this.joueur);
  }

  closePanel() {
    this.joueur = null;
  }

  generateQRCodeValue(): string {
    if (!this.joueur) return ''; 
    return JSON.stringify({
      nom: this.joueur.nameUsers,
      prenom: this.joueur.prenomUser,
      email: this.joueur.emailUser,
      telephone: this.joueur.telephoneUser
    });
  }

  downloadPDF(): void {
    if (!this.joueur) return;

    // Créer un nouveau document PDF au format A4
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Ajouter une police personnalisée si nécessaire
    pdf.setFont("helvetica");
    
    // Définir les couleurs principales
    const primaryColor = [0, 76, 153]; // Bleu foncé
    const secondaryColor = [0, 120, 215]; // Bleu clair
    const accentColor = [255, 140, 0]; // Orange
    
    // Dimensions de la page
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let y = 20; // Position Y initiale
    
    // Ajouter un fond de page léger
    pdf.setFillColor(245, 245, 250);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // En-tête avec dégradé
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.rect(0, 0, pageWidth, 40, 'F');
    
    // Bande décorative
    pdf.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    pdf.rect(0, 40, pageWidth, 5, 'F');
    
    // Titre du rapport
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text('RAPPORT DU JOUEUR', margin, 25);
    
    // Date du rapport
    const today = new Date();
    const dateStr = today.toLocaleDateString('fr-FR');
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Date: ${dateStr}`, pageWidth - 50, 25);
    
    y = 60; // Position après l'en-tête
    
    // Section d'informations personnelles
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text('INFORMATIONS PERSONNELLES', margin, y);
    y += 2;
    
    // Ligne de séparation
    pdf.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y + 5, pageWidth - margin, y + 5);
    y += 15;
    
    // Espace pour la photo du joueur
    if (this.joueur.photoUser) {
      pdf.addImage(this.joueur.photoUser, 'JPEG', pageWidth - 65, y - 10, 50, 50);
    } else {
      // Placeholder pour la photo
      pdf.setFillColor(200, 200, 200);
      pdf.roundedRect(pageWidth - 65, y - 10, 50, 50, 3, 3, 'F');
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(10);
      pdf.text('Photo non disponible', pageWidth - 60, y + 15);
    }
    
    // Informations du joueur
    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text('Nom complet:', margin, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(`${this.joueur.nameUsers} ${this.joueur.prenomUser}`, margin + 50, y);
    y += 10;
    
    pdf.setFont("helvetica", "bold");
    pdf.text('Email:', margin, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(this.joueur.emailUser, margin + 50, y);
    y += 10;
    
    pdf.setFont("helvetica", "bold");
    pdf.text('Téléphone:', margin, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(this.joueur.telephoneUser, margin + 50, y);
    y += 10;
    
    pdf.setFont("helvetica", "bold");
    pdf.text('Position:', margin, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(this.joueur.posteJoueur, margin + 50, y);
    y += 10;
    
    pdf.setFont("helvetica", "bold");
    pdf.text('Numéro:', margin, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(this.joueur.numeroJoueur.toString(), margin + 50, y);
    y += 20;
    
    // Section contrat
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setFontSize(18);
    pdf.setFont("helvetica", "bold");
    pdf.text('DÉTAILS DU CONTRAT', margin, y);
    y += 2;
    
    // Ligne de séparation
    pdf.line(margin, y + 5, pageWidth - margin, y + 5);
    y += 15;
    
    // Créer un cadre pour les informations de contrat
    pdf.setFillColor(240, 240, 245);
    pdf.roundedRect(margin, y, pageWidth - (margin * 2), 30, 3, 3, 'F');
    
    // Informations de contrat
    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(12);
    y += 10;
    pdf.setFont("helvetica", "bold");
    pdf.text('Début du contrat:', margin + 10, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(this.formatDate(this.joueur.debutContratJoueur), margin + 70, y);
    
    // Augmenter y pour ajouter un espacement vertical entre les deux lignes
    y += 10; 
    
    pdf.setFont("helvetica", "bold");
    pdf.text('Fin du contrat:', pageWidth / 2, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(this.formatDate(this.joueur.finContratJoueur), pageWidth / 2 + 50, y);
    
    y += 10; // Pour continuer avec un bon espacement après
    
    
    // Calculer la durée du contrat
    const debut = this.joueur.debutContratJoueur ? new Date(this.joueur.debutContratJoueur) : new Date();
    const fin = this.joueur.finContratJoueur ? new Date(this.joueur.finContratJoueur) : new Date();
    const dureeAnnees = fin.getFullYear() - debut.getFullYear();
    const dureeMois = fin.getMonth() - debut.getMonth();
    let dureeStr = '';
    
    if (dureeAnnees > 0) {
      dureeStr += `${dureeAnnees} an${dureeAnnees > 1 ? 's' : ''}`;
    }
    if (dureeMois > 0) {
      dureeStr += `${dureeStr ? ' et ' : ''}${dureeMois} mois`;
    }
    
    pdf.setFont("helvetica", "bold");
    pdf.text('Durée totale:', margin + 10, y);
    pdf.setFont("helvetica", "normal");
    pdf.text(dureeStr, margin + 70, y);
    
    y += 25;
    
    // Section rapport médical (si disponible)
    if (this.joueur.rapport) {
      pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text('RAPPORT MÉDICAL', margin, y);
      y += 2;
      
      // Ligne de séparation
      pdf.line(margin, y + 5, pageWidth - margin, y + 5);
      y += 15;
      
      // Cadre pour le rapport médical
      const etatColor = this.getEtatColor(this.joueur.rapport.etatRapport);
      pdf.setFillColor(etatColor[0], etatColor[1], etatColor[2], 0.1);
      pdf.roundedRect(margin, y, pageWidth - (margin * 2), 40, 3, 3, 'F');
      
      y += 10;
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(12);
      
      pdf.setFont("helvetica", "bold");
      pdf.text('État actuel:', margin + 10, y);
      
      // Afficher l'état avec une couleur correspondante
      pdf.setTextColor(etatColor[0], etatColor[1], etatColor[2]);
      pdf.setFont("helvetica", "bold");
      pdf.text(this.joueur.rapport.etatRapport, margin + 70, y);
      
      y += 10;
      pdf.setTextColor(60, 60, 60);
      pdf.setFont("helvetica", "bold");
      pdf.text('Blessure:', margin + 10, y);
      pdf.setFont("helvetica", "normal");
      
      // Gérer le texte long pour la blessure
      const blessureText = this.joueur.rapport.blessureRapport || 'Aucune blessure signalée';
      const splitBlessure = pdf.splitTextToSize(blessureText, pageWidth - margin * 2 - 80);
      pdf.text(splitBlessure, margin + 70, y);
      
      y += splitBlessure.length * 7 + 10;
    } else {
      y += 10;
    }
    
    // QR Code
    const qrElement = document.querySelector('.qr-code canvas');
    if (qrElement) {
      html2canvas(qrElement as HTMLElement).then((canvas) => {
        const qrImg = canvas.toDataURL('image/png');
        
        // Cadre pour le QR code
        pdf.setFillColor(245, 245, 250);
        pdf.roundedRect(pageWidth - 65, y - 10, 50, 60, 3, 3, 'F');
        
        // Titre du QR code
        pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.text('SCAN ME', pageWidth - 45, y - 3);
        
        // Ajouter le QR code
        pdf.addImage(qrImg, 'PNG', pageWidth - 60, y, 40, 40);
        
        // Pied de page
        this.addFooter(pdf);
        
        pdf.save('player-details.pdf');
      });
    } else {
      // Pied de page
      this.addFooter(pdf);
      
      pdf.save('player-details.pdf');
    }
  }
  
  // Méthode pour ajouter un pied de page
  private addFooter(pdf: jsPDF): void {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Ligne de séparation
    pdf.setDrawColor(0, 76, 153);
    pdf.setLineWidth(0.5);
    pdf.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);
    
    // Texte du pied de page
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "normal");
    pdf.text('Document généré automatiquement - Confidentiel', 15, pageHeight - 15);
    
    // Date de génération
    const today = new Date();
    const dateStr = today.toLocaleDateString('fr-FR') + ' ' + today.toLocaleTimeString('fr-FR');
    pdf.text(`Généré le: ${dateStr}`, pageWidth - 70, pageHeight - 15);
  }
  
  // Méthode pour formater les dates
  private formatDate(dateStr: string | Date): string {
    if (!dateStr) return 'Non spécifié';
    
    let date: Date;
    if (dateStr instanceof Date) {
      date = dateStr;
    } else {
      date = new Date(dateStr);
    }
    
    return date.toLocaleDateString('fr-FR');
  }
  
  // Méthode pour obtenir la couleur en fonction de l'état
  private getEtatColor(etat: string): number[] {
    if (!etat) return [100, 100, 100]; // Gris par défaut
    
    const etatLower = etat.toLowerCase();
    
    if (etatLower.includes('blessé') || etatLower.includes('blesse') || etatLower.includes('indisponible')) {
      return [220, 53, 69]; // Rouge
    } else if (etatLower.includes('récupération') || etatLower.includes('recuperation') || etatLower.includes('partiel')) {
      return [255, 193, 7]; // Jaune/Orange
    } else if (etatLower.includes('disponible') || etatLower.includes('actif')) {
      return [40, 167, 69]; // Vert
    } else {
      return [0, 123, 255]; // Bleu
    }
  }
}