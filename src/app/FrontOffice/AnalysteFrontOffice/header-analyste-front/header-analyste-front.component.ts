import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-header-analyste-front',
    templateUrl: './header-analyste-front.component.html',
    styleUrls: ['./header-analyste-front.component.css'],
    standalone: false
})
export class HeaderAnalysteFrontComponent {


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
    if (currentUrl.includes('analyste')) {
      this.pageTitle = 'Welcome Analyst';
    } else if (currentUrl.includes('listTactic')) {
      this.pageTitle = 'Management Tactic';
    } else if (currentUrl.includes('showFormation')) {
      this.pageTitle = 'Management Formation';
    } else if (currentUrl.includes('ShowSousGroups')) {
      this.pageTitle = 'Management Sub Groups';
    } else if (currentUrl.includes('showseance')) {
      this.pageTitle = 'Management Session';
    } else if (currentUrl.includes('showexercice')) {
      this.pageTitle = 'Management Exercices';
    } else {
      this.pageTitle = 'Welcome';
    }
  }

}
