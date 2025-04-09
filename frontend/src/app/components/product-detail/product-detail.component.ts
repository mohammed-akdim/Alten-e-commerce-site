import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { Product } from '../../models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product!: Product;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const productIdParam = this.route.snapshot.paramMap.get('id');
    if (productIdParam) {
      const productId = Number(productIdParam);
      this.loadProduct(productId);
    }
  }

  loadProduct(productId: number): void {
    this.productService.getProduct(productId).subscribe(product => {
      this.product = product;
    });
  }

  addToCart(): void {
    this.cartService.addToCart(this.product.id, 1).subscribe({
      next: () => this.snackBar.open('Produit ajouté au panier', 'Fermer', { duration: 3000 }),
      error: (err) => this.snackBar.open('Erreur lors de l\'ajout', 'Fermer', { duration: 3000 })
    });
  }

  toggleWishlist(): void {
    if (this.isInWishlist(this.product.id)) {
      this.wishlistService.removeFromWishlist(this.product.id).subscribe(() => {
        this.snackBar.open('Retiré de la liste de souhaits', 'Fermer', { duration: 2000 });
      });
    } else {
      this.wishlistService.addToWishlist(this.product.id).subscribe(() => {
        this.snackBar.open('Ajouté à la liste de souhaits', 'Fermer', { duration: 2000 });
      });
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistService.isInWishlist(productId);
  }
} 