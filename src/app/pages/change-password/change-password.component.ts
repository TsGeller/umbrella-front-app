import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePasswordComponent {
  form: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordsMatch }
    );
  }

  private passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (!newPassword || !confirmPassword) {
      return null;
    }

    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  get currentPassword(): AbstractControl | null {
    return this.form.get('currentPassword');
  }

  get newPassword(): AbstractControl | null {
    return this.form.get('newPassword');
  }

  get confirmPassword(): AbstractControl | null {
    return this.form.get('confirmPassword');
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.form.value;
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Mot de passe mis à jour avec succès.';
        this.form.reset();
        setTimeout(() => this.router.navigate(['/home']), 1500);
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage =
          error?.error?.message ??
          "Impossible de mettre à jour le mot de passe. Veuillez réessayer.";
      },
    });
  }

  navigateBack(): void {
    this.router.navigate(['/home']);
  }
}
