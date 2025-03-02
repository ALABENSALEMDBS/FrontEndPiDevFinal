import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-header-doctor-front',
    templateUrl: './header-doctor-front.component.html',
    styleUrls: ['./header-doctor-front.component.css'],
    standalone: false
})
export class HeaderDoctorFrontComponent {
    pageTitle: string = '';

    isDropdownOpen = false;
  
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

    constructor(private router: Router, private route: ActivatedRoute) {}
  
    ngOnInit() {
      this.router.events.subscribe(() => {
        this.setPageTitle();
      });
    }
  
    setPageTitle() {
      const currentUrl = this.router.url;
  
      // Define dynamic titles for each route
      if (currentUrl.includes('doctor/Homedoctors')) {
        this.pageTitle = 'Welcome  Doctor to your Sports Medical Space!';
      } else if (currentUrl.includes('listenouriture')) {
        this.pageTitle = 'Healthy Food Management';
      } else if (currentUrl.includes('showFormation')) {
        this.pageTitle = 'Management Formation';
      } else if (currentUrl.includes('ShowSousGroups')) {
        this.pageTitle = 'Management Sub Groups';
      } else if (currentUrl.includes('listeExercicedeRetablissement')) {
        this.pageTitle = 'Management Recovery Exercises';
      } else if (currentUrl.includes('listefiche')) {
        this.pageTitle = 'Management Medical sheet';
      } else {
        this.pageTitle = 'Welcome';
      }
    }
  }
