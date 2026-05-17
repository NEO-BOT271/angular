import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CartItem } from '../interfaces/cart';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);

  cartItems = signal<CartItem[]>([]);
  
  cartCount = signal<number>(0);

  fetchCart() {
    this.http.get<any>(`${environment.apiUrl}/api/cart`).subscribe({
      next: (res) => {
        const items = res.data?.items || res.items || [];
        this.cartItems.set(items);
        
        const count = items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);
        this.cartCount.set(count);
      },
      error: (err) => console.error('Failed to fetch cart', err)
    });
  }

  addToCart(productId: number, quantity: number = 1) {
    return this.http.post(`${environment.apiUrl}/api/cart/add-to-cart`, { productId, quantity });
  }

updateQuantity(itemId: number, quantity: number) {
  const payload = { 
    itemId: Number(itemId),
    quantity: Number(quantity) 
  };
  
  return this.http.put(`${environment.apiUrl}/api/cart/edit-quantity`, payload);
}

  removeItem(itemId: number) {
    return this.http.delete(`${environment.apiUrl}/api/cart/remove-from-cart/${itemId}`);
  }

  checkout() {
    return this.http.post(`${environment.apiUrl}/api/cart/checkout`, {});
  }
}