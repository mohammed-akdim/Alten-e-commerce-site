import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ContactService } from '../../services/contact.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  isAuthenticated = false;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private contactService: ContactService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.currentUser$.subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.maxLength(300)]]
    });
  }

  get email() { return this.contactForm.get('email'); }
  get message() { return this.contactForm.get('message'); }

  onSubmit(): void {
    if (!this.isAuthenticated) {
      this.snackBar.open('Veuillez vous connecter pour envoyer un message', 'Fermer', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }

    if (this.contactForm.valid) {
      this.contactService.sendContactMessage(this.contactForm.value).subscribe({
        next: () => {
          this.snackBar.open('Demande de contact envoyée avec succès', 'Fermer', { duration: 3000 });
          this.contactForm.reset();
          Object.keys(this.contactForm.controls).forEach(key => {
            this.contactForm.get(key)?.markAsPristine();
            this.contactForm.get(key)?.markAsUntouched();
          });
        },
        error: (error) => {
          console.error('Error sending contact message:', error);
          this.snackBar.open('Erreur lors de l\'envoi du message', 'Fermer', { duration: 3000 });
        }
      });
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
} 