import { Component } from '@angular/core';
import { NavbarHomeComponent } from '../navbar-home/navbar-home.component';
import { FooterHomeComponent } from '../footer-home/footer-home.component';

@Component({
  selector: 'app-player-page',
  imports:[NavbarHomeComponent,FooterHomeComponent],
  
  templateUrl: './player-page.component.html',
  styleUrls: ['./player-page.component.css']
})
export class PlayerPageComponent {

}
