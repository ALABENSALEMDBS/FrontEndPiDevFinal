import { Component, OnInit } from '@angular/core';
import { JoueurService } from 'src/app/services/serviceAdminClub/serviceJoueur/joueur.service';
import { Joueurs } from 'src/core/models/joueur';

@Component({
  selector: 'app-list-joueur',
  templateUrl: './list-joueur.component.html',
  styleUrls: ['./list-joueur.component.css']
})
export class ListJoueurComponent implements OnInit{
    joueur: Joueurs[] = [];
  constructor(private joueurService: JoueurService) {}


  ngOnInit(): void {
    this.getJoueurs();
  }

  getJoueurs(): void {
    this.joueurService.getAllJoueurs().subscribe(data => {
      this.joueur = data;
    });
  }

}
