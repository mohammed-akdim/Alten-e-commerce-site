import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  orderCount = 0;
  productCount = 0;
  userCount = 0;
  recentOrders: any[] = [];
  displayedColumns = ['id', 'user', 'total', 'status', 'date'];

  constructor() {}

  ngOnInit() {
    // TODO: Implement actual data loading
    this.orderCount = 150;
    this.productCount = 45;
    this.userCount = 89;
    this.recentOrders = [
      {
        id: 1,
        user: { name: 'John Doe' },
        total: 299.99,
        status: 'completed',
        createdAt: new Date()
      },
      {
        id: 2,
        user: { name: 'Jane Smith' },
        total: 199.99,
        status: 'processing',
        createdAt: new Date()
      }
    ];
  }
} 