import { Component } from '@angular/core';
import { NavbarHomeComponent } from '../navbar-home/navbar-home.component';
import { FooterHomeComponent } from '../footer-home/footer-home.component';

@Component({
  selector: 'app-contact-page',
  imports:[NavbarHomeComponent,FooterHomeComponent],
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.css']
})
export class ContactPageComponent {

}
