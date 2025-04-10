import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductManagementComponent, ProductDialogComponent } from './product-management.component';
import { ProductService } from '../../../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Product } from '../../../models/product.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

xdescribe('ProductManagementComponent', () => {
  let component: ProductManagementComponent;
  let fixture: ComponentFixture<ProductManagementComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<any>>;

  const mockProducts: Product[] = [
    {
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
    }
  ];

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts', 'createProduct', 'updateProduct', 'deleteProduct']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

    // Initialize the _openDialogs array
    (dialogSpy as any)._openDialogs = [];

    await TestBed.configureTestingModule({
      imports: [
        ProductManagementComponent,
        ProductDialogComponent,
        HttpClientTestingModule,
        MatTableModule,
        MatIconModule,
        MatButtonModule,
        NoopAnimationsModule,
        MatDialogModule,
        MatInputModule,
        MatFormFieldModule,
        FormsModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatPaginatorModule,
        MatSortModule
      ],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    productService.getProducts.and.returnValue(of(mockProducts));
    productService.createProduct.and.returnValue(of(mockProducts[0]));
    productService.updateProduct.and.returnValue(of(mockProducts[0]));
    productService.deleteProduct.and.returnValue(of(void 0));

    dialogRef.afterClosed.and.returnValue(of(mockProducts[0]));
    dialog.open.and.returnValue(dialogRef);

    fixture = TestBed.createComponent(ProductManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockProducts);
  });

  it('should apply filter correctly', () => {
    const event = { target: { value: 'test' } } as unknown as Event;
    component.applyFilter(event);
    expect(component.dataSource.filter).toBe('test');
  });

  it('should open add product dialog and create product', () => {
    // Setup dialog mock
    const dialogData = {
      form: component.productForm,
      isEdit: false
    };
    
    // Call the method
    component.openAddProductDialog();
    
    // Verify dialog was opened with correct data
    expect(dialog.open).toHaveBeenCalledWith(ProductDialogComponent, {
      width: '500px',
      data: dialogData
    });
    
    // Simulate dialog closing with form data
    dialogRef.afterClosed.and.returnValue(of(mockProducts[0]));
    
    // Verify product creation
    expect(productService.createProduct).toHaveBeenCalledWith(mockProducts[0]);
    expect(snackBar.open).toHaveBeenCalledWith('Produit créé avec succès', 'Fermer', { duration: 3000 });
  });

  it('should open edit product dialog and update product', () => {
    // Setup dialog mock
    const dialogData = {
      form: component.productForm,
      isEdit: true,
      product: mockProducts[0]
    };
    
    // Call the method
    component.openEditProductDialog(mockProducts[0]);
    
    // Verify dialog was opened with correct data
    expect(dialog.open).toHaveBeenCalledWith(ProductDialogComponent, {
      width: '500px',
      data: dialogData
    });
    
    // Simulate dialog closing with form data
    dialogRef.afterClosed.and.returnValue(of(mockProducts[0]));
    
    // Verify product update
    expect(productService.updateProduct).toHaveBeenCalledWith(mockProducts[0].id.toString(), mockProducts[0]);
    expect(snackBar.open).toHaveBeenCalledWith('Produit mis à jour avec succès', 'Fermer', { duration: 3000 });
  });

  it('should delete product', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const product = mockProducts[0];
    component.deleteProduct(product);
    expect(productService.deleteProduct).toHaveBeenCalledWith(product.id.toString());
    expect(snackBar.open).toHaveBeenCalledWith('Produit supprimé avec succès', 'Fermer', { duration: 3000 });
  });

  it('should not delete product if user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const product = mockProducts[0];
    component.deleteProduct(product);
    expect(productService.deleteProduct).not.toHaveBeenCalled();
    expect(snackBar.open).not.toHaveBeenCalled();
  });
}); 