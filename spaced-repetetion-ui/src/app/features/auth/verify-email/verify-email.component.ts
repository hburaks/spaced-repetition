import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent {
  verifyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.verifyForm = this.fb.group({
      code: [
        '',
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });
  }

  onSubmit(): void {
    if (this.verifyForm.valid) {
      this.authService.verifyEmail(this.verifyForm.value.code).subscribe({
        next: () => {
          this.router.navigate(['/cards']);
        },
        error: (error) => {
          console.error('Verification failed:', error);
        },
      });
    }
  }
}
