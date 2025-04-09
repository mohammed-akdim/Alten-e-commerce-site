import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';

import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  wishlistItems: Product[] = [];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadWishlistItems();
  }

  loadWishlistItems(): void {
    this.wishlistService.getWishlist().subscribe(productIds => {
      if (productIds.length === 0) {
        this.wishlistItems = [];
        return;
      }

      // Créer un tableau d'observables pour charger chaque produit
      const productObservables = productIds.map(id => 
        this.productService.getProduct(id)
      );

      // Charger tous les produits en parallèle
      forkJoin(productObservables).subscribe({
        next: (products) => {
          this.wishlistItems = products;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des produits:', error);
          this.snackBar.open('Erreur lors du chargement de la liste de souhaits', 'Fermer', {
            duration: 3000
          });
        }
      });
    });
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product.id, 1).subscribe({
      next: () => {
        this.snackBar.open('Produit ajouté au panier', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout au panier:', error);
        this.snackBar.open('Erreur lors de l\'ajout au panier', 'Fermer', { duration: 3000 });
      }
    });
  }

  removeFromWishlist(product: Product): void {
    this.wishlistService.removeFromWishlist(product.id).subscribe({
      next: () => {
        this.wishlistItems = this.wishlistItems.filter(item => item.id !== product.id);
        this.snackBar.open('Produit retiré de la liste de souhaits', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error('Erreur lors du retrait de la liste de souhaits:', error);
        this.snackBar.open('Erreur lors du retrait de la liste de souhaits', 'Fermer', { duration: 3000 });
      }
    });
  }
} 