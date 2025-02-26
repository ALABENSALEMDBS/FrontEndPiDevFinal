import { Component } from '@angular/core';

@Component({
    selector: 'app-header-admin-club',
    templateUrl: './header-admin-club.component.html',
    styleUrls: ['./header-admin-club.component.css'],
    standalone: false
})
export class HeaderAdminClubComponent {
  onMenuItemClick(event: any): void {
    console.log('uu ', event)
    const element = document.querySelector('.dropdown-menu.dropdown-menu-end');
    if (!element) return;

    console.log('uu ', element)

    if (element.classList.contains('show')) {
      element.classList.remove('show');
    }
    else {

      element.classList.add('show');
    }
  }

}

