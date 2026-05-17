import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../services/cart';
import { CartItem } from '../interfaces/cart';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-cart',
  standalone: true, 
  imports: [CommonModule,RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartPage implements OnInit {
  public cartService = inject(CartService);

  subtotal = computed(() => 
    this.cartService.cartItems().reduce((acc, item) => acc + (item.product.price * item.quantity), 0)
  );
  tax = computed(() => this.subtotal() * 0.1);
  total = computed(() => this.subtotal() + this.tax());

  ngOnInit() {
    this.cartService.fetchCart();
  }

updateQty(item: CartItem, change: number) {
  const newQty = item.quantity + change;
  
  if (newQty < 1) {
    this.onRemove(item.id);
    return;
  }


  this.cartService.cartItems.update(items => 
    items.map(i => i.id === item.id ? { ...i, quantity: newQty } : i)
  );


  this.cartService.updateQuantity(item.id, newQty).subscribe({
    next: (res) => {
      console.log('Server acknowledged update:', res);
    },
    error: (err) => {
      console.error("Sync failed, rolling back UI", err);
      this.cartService.fetchCart();
    }
  });
}
  onRemove(itemId: number) {
    this.cartService.removeItem(itemId).subscribe(() => {
      this.cartService.fetchCart();
    });
  }

  onCheckout() {
    this.cartService.checkout().subscribe(() => {
      alert("Order placed successfully!");
      this.cartService.fetchCart();
    });
  }
}