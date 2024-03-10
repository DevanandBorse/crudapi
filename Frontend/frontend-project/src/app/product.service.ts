// src/app/product.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from './product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3003';

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/all/products`);
  }

  addProduct(productName: string, categoryId: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addproduct`, { productName, categoryId });
  }

  updateProduct(productId: number, productName: string, categoryId: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/product/${productId}`, { productName, categoryId });
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/product/${productId}`);
  }
}
