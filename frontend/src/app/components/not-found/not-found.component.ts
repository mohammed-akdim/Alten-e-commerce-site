import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="not-found-container">
      <div class="content">
        <mat-icon class="error-icon">error_outline</mat-icon>
        <h1>404</h1>
        <h2>Page non trouvée</h2>
        <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <button mat-raised-button color="primary" routerLink="/">
          Retour à l'accueil
        </button>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 20px;
    }

    .content {
      max-width: 500px;
    }

    .error-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #f44336;
      margin-bottom: 20px;
    }

    h1 {
      font-size: 72px;
      margin: 0;
      color: #1976d2;
    }

    h2 {
      font-size: 24px;
      margin: 10px 0;
    }

    p {
      color: #666;
      margin-bottom: 30px;
    }

    button {
      min-width: 200px;
    }
  `]
})
export class NotFoundComponent {} 