import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule
  ],
  template: `
    <div class="profile-container">
      <mat-card class="profile-card">
        <mat-card-header>
          <mat-card-title>Mon Profil</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <mat-tab-group>
            <mat-tab label="Informations personnelles">
              <div class="tab-content">
                <form (ngSubmit)="updateProfile()" #profileForm="ngForm">
                  <mat-form-field appearance="outline">
                    <mat-label>Prénom</mat-label>
                    <input matInput [(ngModel)]="formData.firstname" name="firstname" required>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Nom d'utilisateur</mat-label>
                    <input matInput [(ngModel)]="formData.username" name="username" required>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Email</mat-label>
                    <input matInput [(ngModel)]="formData.email" name="email" type="email" required>
                  </mat-form-field>

                  <button mat-raised-button color="primary" type="submit" [disabled]="!profileForm.form.valid">
                    Mettre à jour
                  </button>
                </form>
              </div>
            </mat-tab>

            <mat-tab label="Changer le mot de passe">
              <div class="tab-content">
                <form (ngSubmit)="updatePassword()" #passwordForm="ngForm">
                  <mat-form-field appearance="outline">
                    <mat-label>Ancien mot de passe</mat-label>
                    <input matInput [(ngModel)]="passwordData.currentPassword" name="currentPassword" type="password" required>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Nouveau mot de passe</mat-label>
                    <input matInput [(ngModel)]="passwordData.newPassword" name="newPassword" type="password" required>
                  </mat-form-field>

                  <mat-form-field appearance="outline">
                    <mat-label>Confirmer le nouveau mot de passe</mat-label>
                    <input matInput [(ngModel)]="passwordData.confirmPassword" name="confirmPassword" type="password" required>
                  </mat-form-field>

                  <button mat-raised-button color="primary" type="submit" 
                          [disabled]="!passwordForm.form.valid || !passwordsMatch()">
                    Changer le mot de passe
                  </button>
                </form>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
    }

    .profile-card {
      padding: 20px;
    }

    .tab-content {
      padding: 20px 0;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 20px;
    }

    button {
      width: 100%;
    }

    ::ng-deep .mat-mdc-tab-body-content {
      padding: 20px 0;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  formData = {
    firstname: '',
    username: '',
    email: ''
  };
  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getCurrentUser();
    if (this.user) {
      this.formData = {
        firstname: this.user.firstname,
        username: this.user.username,
        email: this.user.email
      };
    }
  }

  passwordsMatch(): boolean {
    return this.passwordData.newPassword === this.passwordData.confirmPassword;
  }

  updateProfile(): void {
    // Implement profile update logic
    console.log('Updating profile:', this.formData);
  }

  updatePassword(): void {
    if (this.passwordsMatch()) {
      // Implement password update logic
      console.log('Updating password:', {
        currentPassword: this.passwordData.currentPassword,
        newPassword: this.passwordData.newPassword
      });
    }
  }
} 