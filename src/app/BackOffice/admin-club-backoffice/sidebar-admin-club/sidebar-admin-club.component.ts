import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-admin-club',
  templateUrl: './sidebar-admin-club.component.html',
  styleUrls: ['./sidebar-admin-club.component.css']
})
export class SidebarAdminClubComponent {
  onMenuItemClick(event: any): void {
    const element = (event.target as HTMLElement).closest('li.menu-item');

    if (!element) return;


    console.log('uu ', element)
    if (element.classList.contains('open')) {
      element.classList.remove('open');
    }
    else {

      element.classList.add('open');
    }
  }
}
