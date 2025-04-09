import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Connexion</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput [(ngModel)]="formData.email" name="email" type="email" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Mot de passe</mat-label>
              <input matInput [(ngModel)]="formData.password" name="password" type="password" required>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="!loginForm.form.valid">
              Se connecter
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p>Pas encore de compte ? <a routerLink="/register">S'inscrire</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 40px auto;
      padding: 0 20px;
    }

    .login-card {
      padding: 20px;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 20px;
    }

    button {
      width: 100%;
    }

    mat-card-actions {
      text-align: center;
      margin-top: 20px;
    }

    a {
      color: #1976d2;
      text-decoration: none;
    }

    a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  formData = {
    email: '',
    password: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  onSubmit(): void {
    // Trim the inputs to remove any whitespace
    const credentials = {
      email: this.formData.email.trim(),
      password: this.formData.password
    };

    console.log('Submitting credentials:', { email: credentials.email, password: '***' });

    this.authService.login(credentials).subscribe({
      next: () => {
        console.log('Login successful');
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.snackBar.open(
          'La connexion a échoué. Vérifiez vos identifiants.',
          'Fermer',
          { duration: 5000 }
        );
      }
    });
  }
} 