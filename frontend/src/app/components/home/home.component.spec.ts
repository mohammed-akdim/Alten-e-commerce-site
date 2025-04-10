import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { WishlistService } from '../../services/wishlist.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { Product } from '../../models/product.model';
import { Cart } from '../../models/cart.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let cartService: jasmine.SpyObj<CartService>;
  let wishlistService: jasmine.SpyObj<WishlistService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  const mockProducts: Product[] = [
    {
      id: 1,
      name: 'Test Product 1',
      description: 'Description 1',
      price: 99.99,
      image: 'test1.jpg',
      category: 'Test Category',
      stock: 10,
      quantity: 1,
      inventoryStatus: 'INSTOCK',
      rating: 4,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    }
  ];

  const mockCart: Cart = {
    userId: 1,
    items: [{ productId: 1, quantity: 1 }],
    total: 99.99,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts']);
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);
    const wishlistServiceSpy = jasmine.createSpyObj('WishlistService', ['addToWishlist']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        HttpClientTestingModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        RouterTestingModule
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: WishlistService, useValue: wishlistServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    wishlistService = TestBed.inject(WishlistService) as jasmine.SpyObj<WishlistService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    productService.getProducts.and.returnValue(of(mockProducts));
    cartService.addToCart.and.returnValue(of(mockCart));
    wishlistService.addToWishlist.and.returnValue(of(void 0));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load featured products on init', () => {
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.featuredProducts).toEqual(mockProducts);
  });
}); 