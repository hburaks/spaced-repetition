import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

interface ErrorResponse {
  errorCode?: string;
  message: string;
  status: number;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private snackBar: MatSnackBar) {}

  handleError(error: any): string {
    if (error.error && error.error.errorCode) {
      // This is a business exception
      return error.error.message;
    }

    // Generic error message for other types of errors
    return 'An unexpected error occurred. Please try again later.';
  }

  showError(error?: any) {
    let message = 'An unexpected error occurred. Please try again later.';

    if (error?.error?.type === 'business') {
      message = error.error.message;
    }

    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['error-snackbar'],
    });
  }
}
