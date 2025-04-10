import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactComponent } from './contact.component';
import { ContactService } from '../../services/contact.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;
  let contactService: jasmine.SpyObj<ContactService>;
  let authService: jasmine.SpyObj<AuthService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const contactServiceSpy = jasmine.createSpyObj('ContactService', ['sendContactMessage']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', [], { 
      isLoggedIn: true,
      currentUser$: of({ id: 1, email: 'test@test.com' })
    });
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        ContactComponent,
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ContactService, useValue: contactServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    contactService = TestBed.inject(ContactService) as jasmine.SpyObj<ContactService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    contactService.sendContactMessage.and.returnValue(of(void 0));

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.contactForm.get('email')).toBeTruthy();
    expect(component.contactForm.get('message')).toBeTruthy();
  });

  it('should not send message when form is invalid', () => {
    component.contactForm.controls['email'].setValue('');
    component.contactForm.controls['message'].setValue('');
    component.onSubmit();
    expect(contactService.sendContactMessage).not.toHaveBeenCalled();
  });

  it('should send message when form is valid', () => {
    const mockMessage = { email: 'test@test.com', message: 'Test message' };
    contactService.sendContactMessage.and.returnValue(of({}));

    component.contactForm.controls['email'].setValue(mockMessage.email);
    component.contactForm.controls['message'].setValue(mockMessage.message);
    component.onSubmit();

    expect(contactService.sendContactMessage).toHaveBeenCalledWith(mockMessage);
    expect(snackBar.open).toHaveBeenCalledWith('Demande de contact envoyée avec succès', 'Fermer', { duration: 3000 });
  });
}); 