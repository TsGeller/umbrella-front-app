import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage: string = '';
  infoMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],  // ← Changé de 'email' à 'username'
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Si déjà connecté (localStorage ou session encore active), rediriger vers le dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
      return;
    }

    this.authService.checkSession().subscribe(() => {
      if (this.authService.isLoggedIn()) {
        this.router.navigate(['/dashboard']);
      }
    });

    this.route.queryParamMap.subscribe((params) => {
      if (params.get('registered')) {
        this.infoMessage = 'Compte créé avec succès. Vous pouvez maintenant vous connecter.';
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err: { error: { message: string } }) => {
        this.errorMessage = err.error.message || 'Erreur de connexion';
      },
    });
  }
  continueAsGuest() {
  this.router.navigate(['/home']);
}
}
