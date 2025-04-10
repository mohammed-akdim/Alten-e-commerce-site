import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementComponent, UserDialogComponent } from './user-management.component';
import { UserService } from '../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { User } from '../../../models/user.model';
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

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<any>>;

  const mockUsers: User[] = [
    {
      id: '1',
      email: 'test@test.com',
      username: 'testuser',
      firstname: 'Test',
      role: 'user',
      token: 'test-token'
    }
  ];

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUsers', 'createUser', 'updateUser', 'deleteUser']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

    // Initialize the _openDialogs array
    (dialogSpy as any)._openDialogs = [];

    await TestBed.configureTestingModule({
      imports: [
        UserManagementComponent,
        UserDialogComponent,
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
        { provide: UserService, useValue: userServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;

    userService.getUsers.and.returnValue(of(mockUsers));
    userService.createUser.and.returnValue(of(mockUsers[0]));
    userService.updateUser.and.returnValue(of(mockUsers[0]));
    userService.deleteUser.and.returnValue(of(void 0));

    dialogRef.afterClosed.and.returnValue(of(mockUsers[0]));
    dialog.open.and.returnValue(dialogRef);

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    expect(userService.getUsers).toHaveBeenCalled();
    expect(component.dataSource.data).toEqual(mockUsers);
  });

  it('should apply filter correctly', () => {
    const event = { target: { value: 'test' } } as unknown as Event;
    component.applyFilter(event);
    expect(component.dataSource.filter).toBe('test');
  });

  xit('should open add user dialog and create user', () => {
    component.openAddUserDialog();
    expect(dialog.open).toHaveBeenCalled();
    
    // Simulate dialog closing with form data
    dialogRef.afterClosed.and.returnValue(of(mockUsers[0]));
    expect(userService.createUser).toHaveBeenCalledWith(mockUsers[0]);
    expect(snackBar.open).toHaveBeenCalledWith('Utilisateur créé avec succès', 'Fermer', { duration: 3000 });
  });

  xit('should open edit user dialog and update user', () => {
    component.openEditUserDialog(mockUsers[0]);
    expect(dialog.open).toHaveBeenCalled();
    
    // Simulate dialog closing with form data
    dialogRef.afterClosed.and.returnValue(of(mockUsers[0]));
    expect(userService.updateUser).toHaveBeenCalledWith(mockUsers[0].id, mockUsers[0]);
    expect(snackBar.open).toHaveBeenCalledWith('Utilisateur mis à jour avec succès', 'Fermer', { duration: 3000 });
  });

  xit('should delete user', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const user = mockUsers[0];
    component.deleteUser(user);
    expect(userService.deleteUser).toHaveBeenCalledWith(user.id);
    expect(snackBar.open).toHaveBeenCalledWith('Utilisateur supprimé avec succès', 'Fermer', { duration: 3000 });
  });

  it('should not delete user if user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    const user = mockUsers[0];
    component.deleteUser(user);
    expect(userService.deleteUser).not.toHaveBeenCalled();
    expect(snackBar.open).not.toHaveBeenCalled();
  });
}); 