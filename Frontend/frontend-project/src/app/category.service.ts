import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './category.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:3003';

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.apiUrl}/all/category`);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/category/${id}`);
  }

  addCategory(categoryName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addcategory`, { categoryName });
  }

  updateCategory(categoryId: number, categoryName: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/category/${categoryId}`, { categoryName });
  }

  deleteCategory(categoryId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/category/${categoryId}`);
  }
}
