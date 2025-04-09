import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.model'; // Assuming you have an Order model

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:3000/orders'; // Adjust the API URL as needed

  constructor(private http: HttpClient) {}

  // Fetch all orders (requires admin privileges)
  getOrders(): Observable<Order[]> {
    // TODO: Add proper authentication headers
    return this.http.get<Order[]>(this.apiUrl);
  }

  // Fetch a single order by ID
  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }

  // Update an order status (requires admin privileges)
  updateOrderStatus(id: number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}`, { status });
  }
} 