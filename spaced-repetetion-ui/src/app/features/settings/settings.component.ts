import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from './settings.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs/operators';
import { Location } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private snackBar: MatSnackBar,
    private location: Location
  ) {
    this.profileForm = this.fb.group({
      fullName: [''],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading = true;
    this.settingsService
      .getProfileSettings()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (profile) => this.profileForm.patchValue(profile),
        error: () => this.showError('Failed to load profile settings'),
      });
  }

  saveProfileSettings(): void {
    if (this.profileForm.invalid) return;

    this.loading = true;
    this.settingsService
      .updateProfileSettings(this.profileForm.value)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => this.showSuccess('Profile settings saved'),
        error: () => this.showError('Failed to save profile settings'),
      });
  }

  goBack(): void {
    this.location.back();
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    this.loading = true;
    this.settingsService
      .changePassword(this.passwordForm.value)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.showSuccess('Password changed successfully');
          this.passwordForm.reset();
        },
        error: () => this.showError('Failed to change password'),
      });
  }

  private passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null
      : { mismatch: true };
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }
}
