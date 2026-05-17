import { Component, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.scss']
})
export class ForgotPassword {
  private http = inject(HttpClient);

  email = '';
  loading = signal(false);
  message = signal('');
  errorMessage = signal('');

  ForgotPassword() {
    if (!this.email) return;

    this.loading.set(true);
    this.message.set('');
    this.errorMessage.set('');


    const url = `${environment.apiUrl}/api/auth/forgot-password/${this.email}`;

    this.http.post(url, {}).subscribe({
      next: () => {
        this.loading.set(false);
        this.message.set('A reset link has been sent to your email.');
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err.error?.detail || 'Something went wrong. Please try again.');
      }
    });
  }
}