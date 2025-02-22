import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar-back',
  templateUrl: './sidebar-back.component.html',
  styleUrls: ['./sidebar-back.component.css']
})
export class SidebarBackComponent {
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
