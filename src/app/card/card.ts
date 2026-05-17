import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [ CommonModule, RouterLink], 
  templateUrl: './card.html',
  styleUrl: './card.scss'
})
export class Card implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);

  product = signal<any>(null);
  quantity = signal(1);
  relatedProducts = signal<any[]>([]); 

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.fetchProductDetails(id);
        this.fetchRelated(id);
      }
    });
  }

  fetchProductDetails(id: string) {
    this.http.get(`${environment.apiUrl}/api/products/${id}`).subscribe({
      next: (res: any) => this.product.set(res.data),
      error: (err) => console.error(err)
    });
  }

fetchRelated(currentId: string) {
  this.http.get(`${environment.apiUrl}/api/products`).subscribe({
    next: (res: any) => {
      const all = res.data?.products || [];
      const filtered = all.filter((p: any) => p.id !== +currentId);
      const maxIndex = Math.max(0, filtered.length - 3);
      const randomStart = Math.floor(Math.random() * (maxIndex + 1));
      const randomSlice = filtered.slice(randomStart, randomStart + 3);
      this.relatedProducts.set(randomSlice);
    }
  });
}

  updateQty(change: number) {
    const newQty = this.quantity() + change;
    if (newQty >= 1) this.quantity.set(newQty);
  }

  addToCart() {
    const productId = this.product()?.id;
    if (!productId) return;

    this.http.post(`${environment.apiUrl}/api/cart/add-to-cart`, {
      productId: productId,
      quantity: this.quantity()
    }).subscribe({
      next: () => alert('Added to cart!'),
      error: () => alert('Failed to add. Are you logged in?')

    });
  }
}