import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Cart, CartItem } from '../../models/cart.model';
import { Product } from '../../models/product.model';
import { forkJoin, map, switchMap, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  private cartSubscription: Subscription | undefined;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCartDetails();
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }

  loadCartDetails(): void {
    this.cartSubscription = this.cartService.cart$.pipe(
      switchMap(cart => {
        if (!cart || cart.items.length === 0) {
          return of([]); // Return empty array if cart is empty
        }
        // Create an array of Observables to fetch product details for each cart item
        const productRequests = cart.items.map(item =>
          this.productService.getProduct(item.productId).pipe(
            map(product => ({ ...item, product })) // Combine item with its product details
          )
        );
        return forkJoin(productRequests); // Execute all requests in parallel
      })
    ).subscribe({
      next: (detailedItems) => {
        this.cartItems = detailedItems;
      },
      error: (error) => {
        console.error('Error loading cart details:', error);
        this.snackBar.open('Erreur lors du chargement du panier', 'Fermer', { duration: 3000 });
      }
    });

    // Trigger initial load
    this.cartService.getCart().subscribe();
  }

  getTotalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  }

  increaseQuantity(item: CartItem): void {
    this.updateQuantity(item, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      this.updateQuantity(item, item.quantity - 1);
    }
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    this.cartService.updateCartItem(item.productId, newQuantity).subscribe({
      next: () => {
        // No need to manually update cartItems here, cart$ observable handles it
        this.snackBar.open('Quantité mise à jour', 'Fermer', { duration: 2000 });
      },
      error: (err: any) => {
        console.error('Error updating quantity:', err);
        this.snackBar.open('Erreur lors de la mise à jour', 'Fermer', { duration: 3000 });
      }
    });
  }

  removeFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item.productId).subscribe({
      next: () => {
        // No need to manually update cartItems here, cart$ observable handles it
        this.snackBar.open('Article supprimé du panier', 'Fermer', { duration: 3000 });
      },
      error: (err: any) => {
        console.error('Error removing item:', err);
        this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 3000 });
      }
    });
  }

  checkout(): void {
    // TODO: Implement checkout logic (e.g., navigate to checkout page)
    this.snackBar.open('Fonctionnalité de paiement à implémenter', 'Fermer', { duration: 3000 });
  }
} 