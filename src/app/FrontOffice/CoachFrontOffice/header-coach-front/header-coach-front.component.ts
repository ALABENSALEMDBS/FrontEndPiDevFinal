import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-header-coach-front',
    templateUrl: './header-coach-front.component.html',
    styleUrls: ['./header-coach-front.component.css'],
    standalone: false
})
export class HeaderCoachFrontComponent {
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
    if (currentUrl.includes('HomeCoach')) {
      this.pageTitle = 'Welcome Coach';
    } else if (currentUrl.includes('listTactic')) {
      this.pageTitle = 'Management Tactic';
    } else if (currentUrl.includes('showFormation')) {
      this.pageTitle = 'Management Training';
    } else if (currentUrl.includes('ShowSousGroups')) {
      this.pageTitle = 'Management Sub Groups';
    } else if (currentUrl.includes('showseance')) {
      this.pageTitle = 'Management Session';
    } else if (currentUrl.includes('showexercice')) {
      this.pageTitle = 'Management Exercise';
    } else {
      this.pageTitle = 'Welcome';
    }
  }
}