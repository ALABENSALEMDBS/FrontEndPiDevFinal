import { Component, OnInit } from '@angular/core';
import { SeanceService } from 'src/app/services/serviceCoatch/serviceSeance/seance.service';
import { seance } from 'src/core/models/seance';

@Component({
    selector: 'app-list-seance',
    templateUrl: './list-seance.component.html',
    styleUrls: ['./list-seance.component.css'],
    standalone: false
})
export class ListSeanceComponent implements OnInit {

  showPopup = false; // Contrôle l'affichage de la popup   h
  selectedsession: any = null;  
  
     seance: seance[] = [];
    
      constructor(private coatchService: SeanceService) {}
    
      ngOnInit(): void {
        this.getSeances();
      }
    
      getSeances(): void {
        this.coatchService.getAllSeances().subscribe(data => {
          this.seance = data;
        });
      }
      openPopup(seance: any) {
        this.selectedsession = seance;
        this.showPopup = true;
      }
    
      closePopup() {
        this.showPopup = false;
      }
  
  
  
  
  
      showConfirmPopup = false;
      sessionIdToDelete: number | null = null;
    
      // Fonction pour ouvrir le popup de confirmation
      openConfirmPopup(id: number) {
        this.sessionIdToDelete = id;
        this.showConfirmPopup = true;
      }
    
      // Fonction pour fermer le popup
      closeConfirmPopup() {
        this.showConfirmPopup = false;
        this.sessionIdToDelete = null;
      }
    
      // Confirmer la suppression
      confirmDelete() {
        if (this.sessionIdToDelete !== null) {
          this.deleteSeances(this.sessionIdToDelete);
          this.closeConfirmPopup();
        }
      }
  
      deleteSeances(id:any){
        this.coatchService.delSeances(id).subscribe(()=>{
          console.log("deleted session !!!!")
          window.location.reload()
        })
      }
  
  }
  

