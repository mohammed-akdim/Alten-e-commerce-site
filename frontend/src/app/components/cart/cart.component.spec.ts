import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CartComponent } from './cart.component';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, of } from 'rxjs';
import { Cart, CartItem } from '../../models/cart.model';
import { Product } from '../../models/product.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;
  let cartService: jasmine.SpyObj<CartService>;
  let productService: jasmine.SpyObj<ProductService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let cartSubject: BehaviorSubject<Cart>;

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

  const mockCartItem: CartItem = {
    productId: 1,
    quantity: 1,
    product: mockProduct
  };

  beforeEach(async () => {
    cartSubject = new BehaviorSubject<Cart>(mockCart);
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['getCart', 'updateCartItem', 'removeFromCart'], {
      cart$: cartSubject.asObservable()
    });
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProduct']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        CartComponent,
        HttpClientTestingModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatSnackBarModule,
        MatTooltipModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CartService, useValue: cartServiceSpy },
        { provide: ProductService, useValue: productServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    cartService.getCart.and.returnValue(of(mockCart));
    cartService.updateCartItem.and.returnValue(of(mockCart));
    cartService.removeFromCart.and.returnValue(of(mockCart));
    productService.getProduct.and.returnValue(of(mockProduct));

    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart on init', () => {
    expect(cartService.getCart).toHaveBeenCalled();
    expect(component.cartItems.length).toBe(1);
  });

  xit('should update quantity', fakeAsync(() => {
    // Setup
    component.cartItems = [mockCartItem];
    fixture.detectChanges();

    // Action
    component.updateQuantity(mockCartItem, 2);
    tick();
    cartSubject.next({ ...mockCart, items: [{ productId: 1, quantity: 2 }] }); // Simulate cart update after quantity change
    tick();

    // Verification
    expect(cartService.updateCartItem).toHaveBeenCalledWith(mockCartItem.productId, 2);
    expect(snackBar.open).toHaveBeenCalledWith('Quantité mise à jour', 'Fermer', { duration: 2000 });
  }));

  xit('should remove item from cart', fakeAsync(() => {
    // Setup
    component.cartItems = [mockCartItem];
    fixture.detectChanges();

    // Action
    component.removeFromCart(mockCartItem);
    tick();
    cartSubject.next({ ...mockCart, items: [] }); // Simulate cart update after removal
    tick();

    // Verification
    expect(cartService.removeFromCart).toHaveBeenCalledWith(mockCartItem.productId);
    expect(snackBar.open).toHaveBeenCalledWith('Article supprimé du panier', 'Fermer', { duration: 3000 });
  }));

  it('should get total items', () => {
    component.cartItems = [mockCartItem];
    expect(component.getTotalItems()).toBe(1);
  });

  it('should get total price', () => {
    component.cartItems = [mockCartItem];
    expect(component.getTotalPrice()).toBe(99.99);
  });
}); 