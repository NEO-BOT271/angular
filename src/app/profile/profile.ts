import { Component, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss'
})
export class Profile implements OnInit {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private router = inject(Router);

  user = signal<any>(null);
  activeTab = signal<'personal' | 'password' | 'settings'>('personal');
  loading = signal(false);

  passwordData = signal({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  ngOnInit() {
    this.fetchProfile();
  }

  fetchProfile() {
    this.http.get(`${environment.apiUrl}/api/users/profile`).subscribe({
      next: (res: any) => this.user.set(res.data || res)
    });
  }
  setTab(tab: 'personal' | 'password' | 'settings') {
    this.activeTab.set(tab);
  }

  // method:put /api/users/edit
  onUpdateProfile() {
    this.loading.set(true);

    const updatePayload = {
      firstName: this.user().firstName,
      lastName: this.user().lastName,
      phoneNumber: this.user().phoneNumber || "",
      picture: this.user().picture || "",
      address: this.user().address || "",
      age: Number(this.user().age) || 0
    };

    this.http.put(`${environment.apiUrl}/api/users/edit`, updatePayload).subscribe({
      next: () => {
        this.loading.set(false);
        alert('Profile updated successfully!');
        this.fetchProfile();
      },
      error: (err) => {
        this.loading.set(false);
        console.error(err);
        alert('Failed to update profile.');
      }
    });
  }

  // method:put /api/users/change-password
  onChangePassword() {
    const data = this.passwordData();

    if (data.newPassword !== data.confirmPassword) {
      alert("New password doesn't match!");
      return;
    }

    this.loading.set(true);

    const payload = {
      oldPassword: data.oldPassword,
      newPassword: data.newPassword,
      ConfirmPassword: data.confirmPassword
    };

    this.http.put(`${environment.apiUrl}/api/users/change-password`, payload).subscribe({
      next: () => {
        this.loading.set(false);
        alert('Password updated successfully!');
        this.passwordData.set({ oldPassword: '', newPassword: '', confirmPassword: '' });
      },
      error: (err) => {
        this.loading.set(false);
        const errorMsg = err.error?.errors?.ConfirmPassword?.[0] ||
          err.error?.detail ||
          'Password update failed!';
        alert(errorMsg);
      }
    });
  }
  // method:delete /api/users/delete
  DeleteAccount() {
    if (confirm('Are you sure?')) {
      this.http.delete(`${environment.apiUrl}/api/users/delete`).subscribe({
        next: () => {
          this.authService.logout();
          this.router.navigate(['/signup']);
        }
      });
    }
  }
  logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
  }

}