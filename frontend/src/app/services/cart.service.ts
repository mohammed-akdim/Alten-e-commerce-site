import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, switchMap, take, map } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/carts`;
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$ = this.cartSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    // Load cart when user logs in
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadCart();
      } else {
        this.cartSubject.next(null);
      }
    });
  }

  public loadCart(): void {
    console.log('Loading cart from API...');
    this.http.get<Cart>(this.apiUrl).subscribe({
      next: (cart) => {
        console.log('Cart loaded successfully:', cart);
        this.cartSubject.next(cart);
      },
      error: (error) => {
        console.error('Error loading cart:', error);
        // En cas d'erreur, on met un panier vide
        const emptyCart: Cart = {
          userId: this.authService.getCurrentUser()?.id ? parseInt(this.authService.getCurrentUser()?.id || '0') : 0,
          items: [],
          total: 0,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        this.cartSubject.next(emptyCart);
      }
    });
  }

  getCart(): Observable<Cart | null> {
    return this.cart$;
  }

  addToCart(productId: number, quantity: number = 1): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/add`, { productId, quantity }).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  updateQuantity(productId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/${productId}`, { quantity }).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  updateCartItem(productId: number, newQuantity: number): Observable<Cart> {
    return this.cart$.pipe(
      take(1),
      map(currentCart => {
        if (!currentCart) {
          throw new Error('Cart not loaded yet');
        }
        const updatedItems = currentCart.items.map(item => 
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        );
        const finalItems = updatedItems.filter(item => item.quantity > 0);
        if (newQuantity > 0 && !finalItems.some(item => item.productId === productId)) {
          finalItems.push({ productId, quantity: newQuantity });
        }
        return finalItems;
      }),
      switchMap(updatedItems => 
        this.http.put<Cart>(this.apiUrl, { items: updatedItems })
      ),
      tap(updatedCart => this.cartSubject.next(updatedCart))
    );
  }

  removeFromCart(productId: number): Observable<any> {
    return this.http.delete<Cart>(`${this.apiUrl}/${productId}`).pipe(
      tap(cart => this.cartSubject.next(cart))
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete<Cart>(this.apiUrl).pipe(
      tap(() => this.cartSubject.next(null))
    );
  }

  getCartTotal(): number {
    return this.cartSubject.value?.total || 0;
  }

  getCartItems(): CartItem[] {
    return this.cartSubject.value?.items || [];
  }
} 