import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { TacticService } from 'src/app/services/serviceCoatch/servicetacticcoatch/tactic.service';
import { tactic } from 'src/core/models/tactic';

@Component({
    selector: 'app-list-tactic',
    templateUrl: './list-tactic.component.html',
    styleUrls: ['./list-tactic.component.css'],
    standalone: false
})
export class ListTacticComponent implements OnInit {
  tactic: tactic[] = [];
  isModalOpen: boolean = false;
  safeVideoUrl: SafeResourceUrl = '';

  constructor(private service: TacticService,private sanitizer: DomSanitizer,private rout:Router) {}

  openModal(videoUrl: string) {
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }


  ngOnInit(): void {
    this.getTactic();
  }


  getTactic(): void {
    this.service.getAlltactic().subscribe(data => {
      this.tactic = data;
    });
  }


  




  showConfirmPopup = false;
  tacticIdToDelete: number | null = null;

  // Fonction pour ouvrir le popup de confirmation
  openConfirmPopup(id: number) {
    this.tacticIdToDelete = id;
    this.showConfirmPopup = true;
  }

   // Fonction pour fermer le popup
   closeConfirmPopup() {
    this.showConfirmPopup = false;
    this.tacticIdToDelete = null;
  }

   // Confirmer la suppression
   confirmDelete() {
    if (this.tacticIdToDelete !== null) {
      this.deleteTactic(this.tacticIdToDelete);
      this.closeConfirmPopup();
    }
  }




  deleteTactic(id:any){
    this.service.deltactic(id).subscribe(()=>{
      console.log("deleted !!!!")
      window.location.reload()
    })
  }
}
