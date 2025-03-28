import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ShowAllPlayersComponent } from "../show-all-players/show-all-players.component";

@Component({
  selector: 'app-vide',
  imports: [CommonModule, ShowAllPlayersComponent],
  templateUrl: './vide.component.html',
  styleUrl: './vide.component.css'
})
export class VideComponent {
  showPopup = false;

  showPopupO(){
   this.showPopup =true;
   document.documentElement.style.overflow = 'hidden'; // Bloquer le scroll
  }
  showPopupC(){
    this.showPopup =false;
    document.documentElement.style.overflow = ''; // Rétablir le scroll
   }

  coachPhrase = "Transform Your Team, Ignite Your Passion!"
  coachImageUrl = "https://thepfsa.co.uk/wp-content/uploads/2022/07/Football-Coach.jpg"






  closePopup(event: MouseEvent) {
    if (event.target === event.currentTarget) { // Check if the click is on the container
      this.showPopup = false;
      document.documentElement.style.overflow = ''; // Rétablir le scroll

    }
  }
}
