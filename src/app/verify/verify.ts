import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './verify.html',
  styleUrl: './verify.scss'
})
export class VerifyComponent implements OnInit {
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  email = signal('');
  verificationCode = signal('');
  loading = signal(false);
  message = signal({ text: '', type: '' });
ngOnInit() {
  const emailParam = this.route.snapshot.queryParamMap.get('email');
  if (emailParam) {
    this.email.set(emailParam);
  } else {
    console.warn("No email found in URL!");
  }
}

onVerify() {
  if (!this.verificationCode()) return;

  this.loading.set(true);
  this.authService.verifyEmail(this.email(), this.verificationCode()).subscribe({
    next: () => {
      this.loading.set(false);
      alert('Verified! Moving to Login...');
      this.router.navigate(['/login']);
    },
    error: (err) => {
      this.loading.set(false);
      console.error('Verify Error:', err);
      this.message.set({ text: 'Invalid code.', type: 'error' });
    }
  });
}

onResend() {
  const currentEmail = this.email();
  this.loading.set(true);
  this.authService.resendVerification(currentEmail).subscribe({
    next: () => {
      this.loading.set(false);
      this.message.set({ text: 'Code resent!', type: 'success' });
    },
    error: (err) => {
      this.loading.set(false);
      this.message.set({ text: 'Resend failed.', type: 'error' });
    }
  });
}
}