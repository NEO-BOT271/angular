import { Routes } from '@angular/router';
import { LogIn } from './log-in/log-in';
import { SignUp } from './sign-up/sign-up';
import { Home } from './home/home';
import { Menu } from './menu/menu';
import { CartPage } from './cart/cart'
import { MainLayout } from './main-layout/main-layout';
import { ForgotPassword } from './forgot-password/forgot-password';
import { Card } from './card/card';
import { Profile } from './profile/profile';
import { VerifyComponent } from './verify/verify';
export const routes: Routes = [
  { path: 'login', component: LogIn },
  { path: 'signup', component: SignUp },
  { path: 'forgot', component: ForgotPassword },
  { path: 'verify', component: VerifyComponent },
  {
    path: '',
    component: MainLayout,
    children: [
      { path: 'home', component: Home },
      { path: 'menu', component: Menu},
      { path: 'cart', component: CartPage },
      { path: 'card', component: Card },
      { path: 'profile', component: Profile },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];
