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
import { MatChipsModule } from '@angular/material/chips';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-user-management',
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
    ReactiveFormsModule,
    MatChipsModule,
    MatSelectModule
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<User>();
  displayedColumns = ['id', 'username', 'firstname', 'email', 'role', 'actions'];
  userForm!: FormGroup;

  constructor(
    private userService: UserService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initForm() {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      firstname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required]
    });
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.dataSource.data = users;
      },
      error: (error) => {
        this.snackBar.open('Erreur lors du chargement des utilisateurs', 'Fermer', { duration: 3000 });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openAddUserDialog() {
    this.userForm.reset();
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { form: this.userForm, isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.createUser(result).subscribe({
          next: () => {
            this.snackBar.open('Utilisateur créé avec succès', 'Fermer', { duration: 3000 });
            this.loadUsers();
          },
          error: (error) => {
            this.snackBar.open(error.message || 'Erreur lors de la création de l\'utilisateur', 'Fermer', { duration: 3000 });
          }
        });
      }
    });
  }

  openEditUserDialog(user: User) {
    this.userForm.patchValue(user);
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '500px',
      data: { form: this.userForm, isEdit: true, user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.updateUser(user.id, result).subscribe({
          next: () => {
            this.snackBar.open('Utilisateur mis à jour avec succès', 'Fermer', { duration: 3000 });
            this.loadUsers();
          },
          error: (error) => {
            this.snackBar.open(error.message || 'Erreur lors de la mise à jour de l\'utilisateur', 'Fermer', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteUser(user: User) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(user.id).subscribe({
        next: () => {
          this.snackBar.open('Utilisateur supprimé avec succès', 'Fermer', { duration: 3000 });
          this.loadUsers();
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Erreur lors de la suppression de l\'utilisateur', 'Fermer', { duration: 3000 });
        }
      });
    }
  }
}

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title>{{ data.isEdit ? 'Modifier' : 'Ajouter' }} un utilisateur</h2>
    <mat-dialog-content>
      <form [formGroup]="data.form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nom d'utilisateur</mat-label>
          <input matInput formControlName="username" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Prénom</mat-label>
          <input matInput formControlName="firstname" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput type="email" formControlName="email" required>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Mot de passe</mat-label>
          <input matInput type="password" formControlName="password" [required]="!data.isEdit">
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Rôle</mat-label>
          <mat-select formControlName="role" required>
            <mat-option value="user">Utilisateur</mat-option>
            <mat-option value="admin">Administrateur</mat-option>
          </mat-select>
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
export class UserDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { form: FormGroup; isEdit: boolean; user?: User }
  ) {}

  onSubmit() {
    if (this.data.form.valid) {
      this.dialogRef.close(this.data.form.value);
    }
  }
} 