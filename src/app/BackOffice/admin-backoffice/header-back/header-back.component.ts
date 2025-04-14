import { Component, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'app-header-back',
    templateUrl: './header-back.component.html',
    styleUrls: ['./header-back.component.css'],
    standalone: false
})
export class HeaderBackComponent {

  isDropdownOpen = false;

    //constructor(private keycloakService: KeycloakService/*, private router: Router*/) {}
  

    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    }

  // logout() {
  //   this.keycloakService.logout();
  // }



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
