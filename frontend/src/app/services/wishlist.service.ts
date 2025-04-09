import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private apiUrl = `${environment.apiUrl}/wishlists`;
  private wishlistSubject = new BehaviorSubject<number[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();

  constructor(
    private http: HttpClient
  ) {
    this.loadWishlistFromStorage();
    this.syncWithBackend();
  }

  private loadWishlistFromStorage(): void {
    const storedWishlist = localStorage.getItem('wishlist');
    if (storedWishlist) {
      this.wishlistSubject.next(JSON.parse(storedWishlist));
    }
  }

  private saveWishlistToStorage(productIds: number[]): void {
    localStorage.setItem('wishlist', JSON.stringify(productIds));
    this.wishlistSubject.next(productIds);
  }

  private syncWithBackend(): void {
    this.http.get<{productIds: number[]}>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Erreur lors de la synchronisation avec le backend:', error);
        return of({productIds: []});
      })
    ).subscribe(response => {
      this.saveWishlistToStorage(response.productIds);
    });
  }

  getWishlist(): Observable<number[]> {
    return this.http.get<{productIds: number[]}>(this.apiUrl).pipe(
      map(response => response.productIds),
      tap(productIds => {
        this.saveWishlistToStorage(productIds);
      }),
      catchError(error => {
        console.error('Erreur lors de la récupération de la wishlist:', error);
        return of(this.wishlistSubject.getValue());
      })
    );
  }

  addToWishlist(productId: number): Observable<void> {
    const currentWishlist = this.wishlistSubject.getValue();
    if (!currentWishlist.includes(productId)) {
      // Optimistic update
      const updatedWishlist = [...currentWishlist, productId];
      this.saveWishlistToStorage(updatedWishlist);

      return this.http.post<void>(`${this.apiUrl}/add`, { productId }).pipe(
        tap(() => {
          console.log('Produit ajouté aux favoris:', productId);
        }),
        catchError(error => {
          console.error('Erreur lors de l\'ajout aux favoris:', error);
          // Rollback en cas d'erreur
          this.saveWishlistToStorage(currentWishlist);
          throw error;
        })
      );
    }
    return of(undefined);
  }

  removeFromWishlist(productId: number): Observable<void> {
    const currentWishlist = this.wishlistSubject.getValue();
    // Optimistic update
    const updatedWishlist = currentWishlist.filter(id => id !== productId);
    this.saveWishlistToStorage(updatedWishlist);

    return this.http.delete<void>(`${this.apiUrl}/${productId}`).pipe(
      tap(() => {
        console.log('Produit retiré des favoris:', productId);
      }),
      catchError(error => {
        console.error('Erreur lors du retrait des favoris:', error);
        // Rollback en cas d'erreur
        this.saveWishlistToStorage(currentWishlist);
        throw error;
      })
    );
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistSubject.getValue().includes(productId);
  }
} 