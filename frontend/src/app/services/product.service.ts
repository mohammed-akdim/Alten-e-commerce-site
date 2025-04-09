import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    if (!this.authService.isAdmin()) {
      return throwError(() => new Error('Seuls les administrateurs peuvent créer des produits'));
    }
    return this.http.post<Product>(`${environment.apiUrl}/products`, product);
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    if (!this.authService.isAdmin()) {
      return throwError(() => new Error('Seuls les administrateurs peuvent modifier des produits'));
    }
    return this.http.put<Product>(`${environment.apiUrl}/products/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    if (!this.authService.isAdmin()) {
      return throwError(() => new Error('Seuls les administrateurs peuvent supprimer des produits'));
    }
    return this.http.delete<void>(`${environment.apiUrl}/products/${id}`);
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products/search?q=${query}`);
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${environment.apiUrl}/products/category/${category}`);
  }
} 