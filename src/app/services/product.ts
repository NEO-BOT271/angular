import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
interface FilterState {
  search: string;
  categoryId: number | null;
  isVegetarian: boolean;
  spiciness: number;
  minRating: number;
  minPrice: number;
  maxPrice: number;
}
@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/api`;

  getCategories(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/categories`).pipe(
      map(res => res.data || res)
    );
  }

  getFilteredProducts(f: FilterState): Observable<any[]> {
    let params = new HttpParams()
      .set('MinPrice', f.minPrice.toString())
      .set('MaxPrice', f.maxPrice.toString())
      .set('Vegetarian', f.isVegetarian.toString())
      .set('Spiciness', f.spiciness.toString());

    if (f.search) params = params.set('Query', f.search);
    if (f.categoryId) params = params.set('CategoryId', f.categoryId.toString());
    if (f.minRating > 0) params = params.set('Rate', f.minRating.toString());

    return this.http.get<any>(`${this.baseUrl}/products/filter`, { params }).pipe(
      map(res => res.data?.products || [])
    );
  }
  addToCart(productId: number, quantity: number = 1): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/cart/add-to-cart`, { productId, quantity });
  }
}