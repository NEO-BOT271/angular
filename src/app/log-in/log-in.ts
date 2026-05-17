import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './log-in.html',
  styleUrl: './log-in.scss'
})
export class LogIn {
  private authService = inject(AuthService);
  private router = inject(Router);

  hidePassword = signal(true);
  loading = signal(false);
  errorMessage = signal('');

  formData = signal({ email: '', password: '' });

  toggleVisibility() { this.hidePassword.update(v => !v); }

  onSubmit() {
    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.formData()).subscribe({
      next: () => this.router.navigate(['/home']),
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Check Email Or Password!');
        this.loading.set(false);
      }
    });
  }
}