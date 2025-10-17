import { Routes } from '@angular/router';
import { Login } from './login/login.component';
import { Dashboard } from './dashboard/dashboard.component';
import { Register } from './register/register.component';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: '', redirectTo: 'login', pathMatch: 'full' },  // route par défaut
  { path: '**', redirectTo: 'login' } // si route inexistante
];
