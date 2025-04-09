import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule
  ]
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  cartItemCount = 0;
  private authSubscription: Subscription | undefined;
  private cartSubscription: Subscription | undefined;

  constructor(
    public authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      console.log('Auth state changed:', { isLoggedIn: !!user });
      this.isLoggedIn = !!user;
      if (user) {
        console.log('Loading cart for user:', user.email);
        this.cartService.loadCart();
      }
    });

    this.cartSubscription = this.cartService.cart$.subscribe(cart => {
      console.log('Cart updated:', cart);
      this.cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
      console.log('New cart item count:', this.cartItemCount);
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.cartSubscription?.unsubscribe();
  }
} 