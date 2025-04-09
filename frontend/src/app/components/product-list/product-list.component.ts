import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchQuery: string = '';

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
    });
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.productService.searchProducts(this.searchQuery).subscribe(products => {
        this.products = products;
      });
    } else {
      this.loadProducts();
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(Number(product.id), 1).subscribe({
      next: () => {
        this.snackBar.open('Produit ajouté au panier', 'Fermer', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error adding to cart:', error);
        this.snackBar.open(
          'Erreur lors de l\'ajout au panier. Veuillez réessayer.',
          'Fermer',
          { duration: 3000 }
        );
      }
    });
  }

  toggleWishlist(product: Product): void {
    if (this.isInWishlist(product.id)) {
      this.wishlistService.removeFromWishlist(product.id).subscribe(() => {
        this.snackBar.open('Retiré de la liste de souhaits', 'Fermer', { duration: 2000 });
      });
    } else {
      this.wishlistService.addToWishlist(product.id).subscribe(() => {
        this.snackBar.open('Ajouté à la liste de souhaits', 'Fermer', { duration: 2000 });
      });
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }
} 