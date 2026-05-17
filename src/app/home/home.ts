import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, DecimalPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);

  products = signal<any[]>([]);

  ngOnInit() {
    this.fetchPopularDishes();
  }

  fetchPopularDishes() {
    this.http.get(`${environment.apiUrl}/api/products`).subscribe({
      next: (res: any) => {
        const productArray = res.data?.products || res.data || [];
        this.products.set(productArray.slice(0, 6));
      },
      error: (err) => console.error('Failed to load products', err)
    });
  }

  handleAddToCart(event: Event, productId: number) {
    event.stopPropagation();
    const token = localStorage.getItem('token');

    if (!token || token === 'null') {
      this.router.navigate(['/login']);
      return;
    }

    this.http.post(`${environment.apiUrl}/api/cart/add-to-cart`, {
      productId: productId,
      quantity: 1
    }).subscribe({
      next: () => alert('Successfully added to cart!'),
      error: () => alert('Error adding to cart!')
    });
  }

  goToProductDetail(productId: number) {
    this.router.navigate(['/card'], { queryParams: { id: productId } });
  }
}