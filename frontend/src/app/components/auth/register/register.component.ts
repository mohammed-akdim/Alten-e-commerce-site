import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
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
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Inscription</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form (ngSubmit)="onSubmit()" #registerForm="ngForm">
            <mat-form-field appearance="outline">
              <mat-label>Nom d'utilisateur</mat-label>
              <input matInput [(ngModel)]="formData.username" name="username" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Prénom</mat-label>
              <input matInput [(ngModel)]="formData.firstname" name="firstname" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput [(ngModel)]="formData.email" name="email" type="email" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Mot de passe</mat-label>
              <input matInput [(ngModel)]="formData.password" name="password" type="password" required>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Confirmer le mot de passe</mat-label>
              <input matInput [(ngModel)]="formData.confirmPassword" name="confirmPassword" type="password" required>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" [disabled]="!registerForm.form.valid || !passwordsMatch()">
              S'inscrire
            </button>
          </form>
        </mat-card-content>
        <mat-card-actions>
          <p>Déjà un compte ? <a routerLink="/login">Se connecter</a></p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .register-container {
      max-width: 400px;
      margin: 40px auto;
      padding: 0 20px;
    }

    .register-card {
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
export class RegisterComponent {
  formData = {
    username: '',
    firstname: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  passwordsMatch(): boolean {
    return this.formData.password === this.formData.confirmPassword;
  }

  onSubmit(): void {
    if (this.passwordsMatch()) {
      const { confirmPassword, ...userData } = this.formData;
      this.authService.register(userData).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          // Handle registration error (show error message)
        }
      });
    }
  }
} 