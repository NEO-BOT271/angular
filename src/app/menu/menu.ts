import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product';
interface FilterState {
  search: string;
  categoryId: number | null;
  isVegetarian: boolean;
  spiciness: number;
  minRating: number;
  minPrice: number;
  maxPrice: number;
}
@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu implements OnInit {
  private productService = inject(ProductService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  categories = signal<any[]>([]);
  products = signal<any[]>([]);
  filters = signal<FilterState>({
    search: '',
    categoryId: null,
    isVegetarian: false,
    spiciness: 0,
    minRating: 0,
    minPrice: 0,
    maxPrice: 500
  });
  ngOnInit() {
    this.productService.getCategories().subscribe(cats => this.categories.set(cats));

    this.route.queryParams.subscribe(params => {
      const urlFilters: FilterState = {
        search: params['Query'] || '',
        categoryId: params['CategoryId'] ? +params['CategoryId'] : null,
        isVegetarian: params['Vegetarian'] === 'true',
        spiciness: params['Spiciness'] ? +params['Spiciness'] : 0, // Added
        minPrice: params['MinPrice'] ? +params['MinPrice'] : 0,
        maxPrice: params['MaxPrice'] ? +params['MaxPrice'] : 500,
        minRating: params['Rate'] ? +params['Rate'] : 0
      };

      this.filters.set(urlFilters);
      this.loadProducts(urlFilters);
    });
  }

  loadProducts(f: FilterState) {
    this.productService.getFilteredProducts(f).subscribe(res => {
      this.products.set(res);
    });
  }


  updateFilter(key: keyof FilterState, value: any) {
    const keyMap: Record<string, string> = {
      search: 'Query',
      categoryId: 'CategoryId',
      isVegetarian: 'Vegetarian',
      spiciness: 'Spiciness',
      minRating: 'Rate',
      minPrice: 'MinPrice',
      maxPrice: 'MaxPrice'
    };

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [keyMap[key]]: value },
      queryParamsHandling: 'merge'
    });
  }
  clearAll() {
    this.router.navigate([], { queryParams: {} });
  }

  handleAddToCart(productId: number) {
    const token = localStorage.getItem('token');

    if (!token || token === 'null') {
      this.router.navigate(['/login']);
      return;
    }
    this.productService.addToCart(productId, 1).subscribe({
      next: (res) => {
        alert('Product added to cart!');
      },
      error: (err) => console.error('Cart Error:', err)
    });
  }


  goToProductDetail(id: number) {
    this.router.navigate(['/card'], { queryParams: { id } });
  }

  toggleCategory(id: number) {
    const current = this.filters().categoryId;
    this.updateFilter('categoryId', current === id ? null : id);
  }
}




