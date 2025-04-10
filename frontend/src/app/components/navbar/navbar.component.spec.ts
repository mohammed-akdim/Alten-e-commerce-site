import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { User } from '../../models/user.model';
import { Cart } from '../../models/cart.model';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let cartService: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['currentUser$', 'logout', 'isAdmin']);
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['cart$', 'loadCart']);

    authServiceSpy.currentUser$ = of(null);
    authServiceSpy.isAdmin.and.returnValue(false);
    cartServiceSpy.cart$ = of(null);

    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        MatMenuModule,
        MatIconModule,
        MatBadgeModule
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CartService, useValue: cartServiceSpy }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update isLoggedIn when user changes', () => {
    const mockUser: User = {
      id: '1',
      email: 'test@test.com',
      username: 'testuser',
      firstname: 'Test',
      role: 'user',
      token: 'test-token'
    };
    authService.currentUser$ = of(mockUser);
    
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.isLoggedIn).toBeTruthy();
  });

  it('should load cart when user is logged in', () => {
    const mockUser: User = {
      id: '1',
      email: 'test@test.com',
      username: 'testuser',
      firstname: 'Test',
      role: 'user',
      token: 'test-token'
    };
    authService.currentUser$ = of(mockUser);
    
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(cartService.loadCart).toHaveBeenCalled();
  });

  it('should update cartItemCount when cart changes', () => {
    const mockCart: Cart = {
      userId: 1,
      items: [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 3 }
      ],
      total: 100,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    cartService.cart$ = of(mockCart);
    
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.cartItemCount).toBe(5);
  });
}); 