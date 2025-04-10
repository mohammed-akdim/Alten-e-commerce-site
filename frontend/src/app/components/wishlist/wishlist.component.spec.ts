import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { of } from 'rxjs';
import { WishlistComponent } from './wishlist.component';
import { WishlistService } from '../../services/wishlist.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { Product } from '../../models/product.model';
import { Cart } from '../../models/cart.model';

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
  items: [
    {
      productId: 1,
      quantity: 1,
      product: mockProducts[0]
    }
  ],
  total: 99.99,
  createdAt: new Date('2024-01-01').getTime(),
  updatedAt: new Date('2024-01-01').getTime()
};

describe('WishlistComponent', () => {
  let component: WishlistComponent;
  let fixture: ComponentFixture<WishlistComponent>;
  let wishlistService: jasmine.SpyObj<WishlistService>;
  let cartService: jasmine.SpyObj<CartService>;
  let productService: jasmine.SpyObj<ProductService>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    wishlistService = jasmine.createSpyObj('WishlistService', ['getWishlist', 'removeFromWishlist']);
    cartService = jasmine.createSpyObj('CartService', ['addToCart']);
    productService = jasmine.createSpyObj('ProductService', ['getProducts']);
    authService = jasmine.createSpyObj('AuthService', [], { isLoggedIn: true });

    wishlistService.getWishlist.and.returnValue(of([1])); // Return array of product IDs
    wishlistService.removeFromWishlist.and.returnValue(of(void 0));
    cartService.addToCart.and.returnValue(of(mockCart));
    productService.getProducts.and.returnValue(of(mockProducts));

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule
      ],
      providers: [
        { provide: WishlistService, useValue: wishlistService },
        { provide: CartService, useValue: cartService },
        { provide: ProductService, useValue: productService },
        { provide: AuthService, useValue: authService },
        { provide: MatSnackBar, useValue: { open: () => {} } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});