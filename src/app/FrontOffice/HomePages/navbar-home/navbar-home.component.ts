// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-navbar-home',
//   imports: [],
//   templateUrl: './navbar-home.component.html',
//   styleUrl: './navbar-home.component.css'
// })
// export class NavbarHomeComponent {

// }



import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
//import { KeycloakService } from '../../../utils/keycloak/keycloak.service';

@Component({
  selector: 'app-navbar-home',
  imports:[CommonModule,RouterModule,RouterLink],
  templateUrl: './navbar-home.component.html',
  styleUrls: ['./navbar-home.component.css'],
  standalone:true
})
export class NavbarHomeComponent implements OnInit {
  currentPage: string = '';
  isMenuOpen: boolean = false; // State for mobile menu

  constructor(private router: Router, private route: ActivatedRoute /*, private keycloakService: KeycloakService*/ ) {}

  /*logout() {
    this.keycloakService.logout();
  }*/

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.updatePageTitle();
    });
  }

  updatePageTitle(): void {
    const currentUrl = this.router.url;
    switch (currentUrl) {
      case 'home':
        this.currentPage = 'Home';
        break;
      case 'contact':
        this.currentPage = 'Contact Us';
        break;
      case 'player':
        this.currentPage = 'Players';
        break;
      case 'blog':
        this.currentPage = 'Blogs';
        break;
      case 'matches':
        this.currentPage = 'Matches';
        break;
      default:
        this.currentPage = '';
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (window.innerWidth > 991) {
      this.closeMenu(); // Close menu on larger screens
    }
  }
}