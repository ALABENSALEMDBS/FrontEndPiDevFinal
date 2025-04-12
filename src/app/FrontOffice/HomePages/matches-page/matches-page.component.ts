import { Component } from '@angular/core';
import { NavbarHomeComponent } from '../navbar-home/navbar-home.component';
import { FooterHomeComponent } from '../footer-home/footer-home.component';

@Component({
  selector: 'app-matches-page',
  imports:[NavbarHomeComponent,FooterHomeComponent],
  
  templateUrl: './matches-page.component.html',
  styleUrls: ['./matches-page.component.css']
})
export class MatchesPageComponent {

}
