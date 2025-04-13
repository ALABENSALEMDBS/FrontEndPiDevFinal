import { Component } from '@angular/core';
import { NavbarHomeComponent } from '../navbar-home/navbar-home.component';
import { FooterHomeComponent } from '../footer-home/footer-home.component';

@Component({
  selector: 'app-blog-page',
  imports:[NavbarHomeComponent,FooterHomeComponent],
  templateUrl: './blog-page.component.html',
  styleUrls: ['./blog-page.component.css']
})
export class BlogPageComponent {

}
