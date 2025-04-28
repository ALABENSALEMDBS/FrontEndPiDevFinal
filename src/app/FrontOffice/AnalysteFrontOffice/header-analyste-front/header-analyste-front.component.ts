import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-header-analyste-front',
    templateUrl: './header-analyste-front.component.html',
    styleUrls: ['./header-analyste-front.component.css'],
    standalone: false
})
export class HeaderAnalysteFrontComponent {
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

    pageTitle: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.router.events.subscribe(() => {
      this.setPageTitle();
    });
  }

  setPageTitle() {
    const currentUrl = this.router.url;

    // Define dynamic titles for each route
    if (currentUrl.includes('Homeanalyste')) {
      this.pageTitle = 'Welcome Analyst';
    } else if (currentUrl.includes('Reportshow')) {
      this.pageTitle = 'Management Reports';
    } else if (currentUrl.includes('compareplayers')) {
      this.pageTitle = 'Compare Players';
    } else if (currentUrl.includes('PlayerreportstatComponent')) {
      this.pageTitle = 'Recommended Players';
    } else {
      this.pageTitle = 'Welcome';
    }
  }

}
