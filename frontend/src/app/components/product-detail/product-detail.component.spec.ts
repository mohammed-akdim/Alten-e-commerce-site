import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of, throwError } from 'rxjs';
import { Product } from '../../models/product.model';
import { Cart } from '../../models/cart.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let cartService: jasmine.SpyObj<CartService>;
  let wishlistService: jasmine.SpyObj<WishlistService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let router: jasmine.SpyObj<Router>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    image: 'test.jpg',
    category: 'Test Category',
    stock: 10,
    quantity: 1,
    inventoryStatus: 'INSTOCK',
    rating: 4,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  };

  const mockCart: Cart = {
    userId: 1,
    items: [{ productId: 1, quantity: 1 }],
    total: 99.99,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProduct']);
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);
    const wishlistServiceSpy = jasmine.createSpyObj('WishlistService', ['addToWishlist', 'removeFromWishlist', 'isInWishlist']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ProductDetailComponent,
        HttpClientTestingModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: WishlistService, useValue: wishlistServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => '1'
              }
            }
          }
        }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    wishlistService = TestBed.inject(WishlistService) as jasmine.SpyObj<WishlistService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    productService.getProduct.and.returnValue(of(mockProduct));
    wishlistService.isInWishlist.and.returnValue(false);
    cartService.addToCart.and.returnValue(of(mockCart));
    wishlistService.addToWishlist.and.returnValue(of(void 0));
    wishlistService.removeFromWishlist.and.returnValue(of(void 0));

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product on init', () => {
    expect(productService.getProduct).toHaveBeenCalledWith(1);
    expect(component.product).toEqual(mockProduct);
    expect(wishlistService.isInWishlist).toHaveBeenCalledWith(mockProduct.id);
  });

  xit('should handle error when loading product fails', fakeAsync(() => {
    productService.getProduct.and.returnValue(throwError(() => new Error('Failed to load product')));
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();
    expect(snackBar.open).toHaveBeenCalledWith('Erreur lors du chargement du produit', 'Fermer', { duration: 3000 });
  }));

  it('should add product to cart', fakeAsync(() => {
    component.addToCart();
    tick();
    expect(cartService.addToCart).toHaveBeenCalledWith(mockProduct.id, 1);
    expect(snackBar.open).toHaveBeenCalledWith('Produit ajouté au panier', 'Fermer', { duration: 3000 });
  }));

  it('should toggle wishlist status', fakeAsync(() => {
    // Initial state is false
    expect(component.isInWishlist(mockProduct.id)).toBeFalse();

    // Add to wishlist
    component.toggleWishlist();
    tick();
    expect(wishlistService.addToWishlist).toHaveBeenCalledWith(mockProduct.id);
    expect(snackBar.open).toHaveBeenCalledWith('Ajouté à la liste de souhaits', 'Fermer', { duration: 2000 });

    // Update mock to return true
    wishlistService.isInWishlist.and.returnValue(true);
    component.toggleWishlist();
    tick();
    expect(wishlistService.removeFromWishlist).toHaveBeenCalledWith(mockProduct.id);
    expect(snackBar.open).toHaveBeenCalledWith('Retiré de la liste de souhaits', 'Fermer', { duration: 2000 });
  }));

  xit('should handle error when adding to wishlist fails', fakeAsync(() => {
    wishlistService.addToWishlist.and.returnValue(throwError(() => new Error('Failed to add to wishlist')));
    component.toggleWishlist();
    tick();
    expect(snackBar.open).toHaveBeenCalledWith('Erreur lors de l\'ajout à la liste de souhaits', 'Fermer', { duration: 3000 });
  }));

  xit('should handle error when removing from wishlist fails', fakeAsync(() => {
    wishlistService.isInWishlist.and.returnValue(true);
    wishlistService.removeFromWishlist.and.returnValue(throwError(() => new Error('Failed to remove from wishlist')));
    component.toggleWishlist();
    tick();
    expect(snackBar.open).toHaveBeenCalledWith('Erreur lors du retrait de la liste de souhaits', 'Fermer', { duration: 3000 });
  }));
}); 