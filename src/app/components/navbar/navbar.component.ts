import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterModule
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(
    public router: Router,
    private authService: AuthService
  ) {}

  navegarA(ruta: string) {
    this.router.navigate([ruta]);
  }

  getUser() {
    return this.authService.getUser();
  }

  isAdmin(): boolean {
    return this.authService.getUserRole() === 'ADMINISTRADOR';
  }

  logout() {
    this.authService.logout();
  }
}
