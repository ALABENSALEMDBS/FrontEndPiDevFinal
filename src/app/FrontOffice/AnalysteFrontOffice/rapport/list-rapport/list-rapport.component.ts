import { Component } from '@angular/core';
import { RapportService } from 'src/app/services/serviceAnalyste/gerer-rapport/rapport.service';
import { Rapport } from 'src/core/models/rapport';
import { UpdateRapportComponent } from "../update-rapport/update-rapport.component";
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AddRapportComponent } from "../add-rapport/add-rapport.component";

@Component({
  selector: 'app-list-rapport',
  imports: [UpdateRapportComponent, RouterModule, CommonModule],
  templateUrl: './list-rapport.component.html',
  styleUrl: './list-rapport.component.css'
})
export class ListRapportComponent {

  showPopup = false; // Contrôle l'affichage de la popup   h
  selectedRapport: any = null;  
  showAddPopup = false;

  Rapport: Rapport[] = [];
    
      constructor(private RapportService: RapportService) {}
    
      ngOnInit(): void {
        this.getRapport();
      }
    
      getRapport(): void {
        this.RapportService.getAllRapport().subscribe(data => {
          this.Rapport = data;
        });
      }
      openPopup(Rapport: any) {
        this.selectedRapport= Rapport;
        this.showPopup = true;
      }
    
      closePopup() {
        this.showPopup = false;
      }
  
  
      openAddPopup() {
        this.showAddPopup = true;
    }

    closeAddPopup() {
        this.showAddPopup = false;
    }
  
  
      showConfirmPopup = false;
      RapportIdToDelete: number | null = null;
    
      // Fonction pour ouvrir le popup de confirmation
      openConfirmPopup(id: number) {
        this.RapportIdToDelete = id;
        this.showConfirmPopup = true;
      }
    
      // Fonction pour fermer le popup
      closeConfirmPopup() {
        this.showConfirmPopup = false;
        this.RapportIdToDelete = null;
      }
    
      // Confirmer la suppression
      confirmDelete() {
        if (this.RapportIdToDelete !== null) {
          this.deleteRapport(this.RapportIdToDelete);
          this.closeConfirmPopup();
        }
      }
  
      deleteRapport(id:any){
        this.RapportService.delRapport(id).subscribe(()=>{
          console.log("deleted report !!!!")
          window.location.reload()
        })
      }
  
  }
  

