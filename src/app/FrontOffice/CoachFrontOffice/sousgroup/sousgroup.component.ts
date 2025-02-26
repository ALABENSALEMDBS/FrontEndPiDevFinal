import { Component, OnInit } from '@angular/core';
import { SousgroupeService } from 'src/app/services/serviceCoatch/serviceSousGroupe/sousgroupe.service';
import { sousgroup } from 'src/core/models/sousgroup';

@Component({
    selector: 'app-sousgroup',
    templateUrl: './sousgroup.component.html',
    styleUrls: ['./sousgroup.component.css'],
    standalone: false
})
export class SousgroupComponent implements OnInit {
  sousGroupes: sousgroup[] = [];
  showOutlet: boolean = false;

  constructor(private coatchService: SousgroupeService) {}

  ngOnInit(): void {
    this.getSousGroupes();
  }

  getSousGroupes(): void {
    this.coatchService.getAllSousGroupes().subscribe(data => {
      this.sousGroupes = data;
    });
  }

  deleteSousGroup(id:any){
    this.coatchService.delsousGroup(id).subscribe(()=>{
      console.log("deleted !!!!")
      window.location.reload()
    })
  }


  openAddSousGroupModal(): void {
    // Vous pouvez ouvrir un modal ou un formulaire ici pour ajouter un sous-groupe
    console.log("Ajouter un sous-groupe");
  }

 /* updateSousGroup(sg: SousGroupes): void {
    console.log('Mettre à jour le sous-groupe', sg);
    // Logique pour mettre à jour le sous-groupe (par exemple, ouvrir un formulaire de modification)
    // Vous pouvez implémenter un modal ou rediriger vers une page de mise à jour
  }*/
    toggleRouterOutlet() {
      this.showOutlet = !this.showOutlet;
    }
    
}
