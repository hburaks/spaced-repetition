import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CardsService } from '../../../core/services/cards.service';

@Component({
  selector: 'app-card-create',
  templateUrl: './card-create.component.html',
  styleUrls: ['./card-create.component.scss'],
})
export class CardCreateComponent {
  cardForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private cardsService: CardsService,
    private router: Router
  ) {
    this.cardForm = this.fb.group({
      front: ['', [Validators.required]],
      back: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.cardForm.valid) {
      this.cardsService.createCard(this.cardForm.value).subscribe({
        next: () => {
          this.router.navigate(['/cards']);
        },
        error: (error) => {
          console.error('Failed to create card:', error);
        },
      });
    }
  }
}
