import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss'
})
export class SignUp {
  private authService = inject(AuthService);
  private router = inject(Router);

  hidePassword = signal(true);
  loading = signal(false);
  errorMessage = signal('');

  formData = signal({
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  });

  toggleVisibility() {
    this.hidePassword.update(v => !v);
  }

 onSubmit() {
  this.loading.set(true);
  this.errorMessage.set('');

  const emailForVerify = this.formData().email;

  this.authService.register(this.formData()).subscribe({
    next: () => {
      this.router.navigate(['/verify'], { 
        queryParams: { email: emailForVerify } 
      });
    },
    error: (err) => {
      this.errorMessage.set(err.error?.detail || 'Registration failed');
      this.loading.set(false);
    }
  });
}

}