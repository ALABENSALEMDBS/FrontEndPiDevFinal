import { Component } from '@angular/core';

@Component({
  selector: 'app-header-coach-front',
  templateUrl: './header-coach-front.component.html',
  styleUrls: ['./header-coach-front.component.css']
})
export class HeaderCoachFrontComponent {
  isMenuOpen = false;
  darkMode = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    document.documentElement.classList.toggle('dark');
  }
}
