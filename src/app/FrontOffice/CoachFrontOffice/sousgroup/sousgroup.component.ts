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
  selectedChatId: number | null = null;
  sousGroupes: sousgroup[] = [];
  showOutlet: boolean = false;
  images: string[] = [
    'assets/images/images.png',
    'assets/images/images1.jpeg',
    'assets/images/images2.png',
    'assets/images/images3.png',
    'assets/images/images4.png',
    'assets/images/images5.jpg',
    'assets/images/images6png.png',
    'assets/images/images7.png',
    'assets/images/images8.png'
  ];


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

    joueursSousGroupe: any[] = [];
selectedSousGroupId: number | null = null;

showPlayers(idSousGroup: number): void {
  if (this.selectedSousGroupId === idSousGroup) {
    this.selectedSousGroupId = null;
    this.joueursSousGroupe = [];
    return;
  }

  this.selectedSousGroupId = idSousGroup;

  this.coatchService.getPlayersBySousGroup(idSousGroup).subscribe(data => {
    console.log("Données reçues de l'API :", data);
    this.joueursSousGroupe = data.joueurs || [];

    // Vérifier si `joueursSousGroupe` contient bien des joueurs
    console.log("Joueurs stockés :", this.joueursSousGroupe);
  });
}

openChat(idSousGroup: number) {
  this.selectedChatId = idSousGroup;
}



}
