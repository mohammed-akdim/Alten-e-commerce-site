import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-product-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss']
})
export class ProductManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<any>;

  dataSource = new MatTableDataSource<Product>();
  displayedColumns = ['id', 'name', 'price', 'stock', 'category', 'actions'];
  filterValue = '';
  productForm!: FormGroup;

  constructor(
    private productService: ProductService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      image: ['', Validators.required]
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.dataSource.data = products;
      },
      error: (error) => {
        this.snackBar.open('Erreur lors du chargement des produits', 'Fermer', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddProductDialog() {
    this.productForm.reset();
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '500px',
      data: { form: this.productForm, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.createProduct(result).subscribe({
          next: () => {
            this.snackBar.open('Produit créé avec succès', 'Fermer', { duration: 3000 });
            this.loadProducts();
          },
          error: (error) => {
            this.snackBar.open(error.message || 'Erreur lors de la création du produit', 'Fermer', { duration: 3000 });
          }
        });
      }
    });
  }

  openEditProductDialog(product: Product) {
    this.productForm.patchValue(product);
    const dialogRef = this.dialog.open(ProductDialogComponent, {
      width: '500px',
      data: { form: this.productForm, isEdit: true, product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.updateProduct(product.id.toString(), result).subscribe({
          next: () => {
            this.snackBar.open('Produit mis à jour avec succès', 'Fermer', { duration: 3000 });
            this.loadProducts();
          },
          error: (error) => {
            this.snackBar.open(error.message || 'Erreur lors de la mise à jour du produit', 'Fermer', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteProduct(product: Product) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.productService.deleteProduct(product.id.toString()).subscribe({
        next: () => {
          this.snackBar.open('Produit supprimé avec succès', 'Fermer', { duration: 3000 });
          this.loadProducts();
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Erreur lors de la suppression du produit', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}

@Component({
  selector: 'app-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.isEdit ? 'Modifier' : 'Ajouter' }} un produit</h2>
    <mat-dialog-content>
      <form [formGroup]="data.form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nom</mat-label>
          <input matInput formControlName="name" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description</mat-label>
          <textarea matInput formControlName="description" required></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Prix</mat-label>
          <input matInput type="number" formControlName="price" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Stock</mat-label>
          <input matInput type="number" formControlName="stock" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Catégorie</mat-label>
          <input matInput formControlName="category" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Image URL</mat-label>
          <input matInput formControlName="image" required>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Annuler</button>
      <button mat-raised-button color="primary" [disabled]="!data.form.valid" (click)="onSubmit()">
        {{ data.isEdit ? 'Modifier' : 'Ajouter' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
  `]
})
export class ProductDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { form: FormGroup; isEdit: boolean; product?: Product }
  ) {}

  onSubmit() {
    if (this.data.form.valid) {
      this.dialogRef.close(this.data.form.value);
    }
  }
} 