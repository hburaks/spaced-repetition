import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { CardReviewComponent } from './card-review/card-review.component';
import { CardCreateComponent } from './card-create/card-create.component';
import { CardListComponent } from './card-list/card-list.component';
import { CardEditDialogComponent } from './card-edit-dialog/card-edit-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

const routes: Routes = [
  { path: '', component: CardListComponent },
  { path: 'review', component: CardReviewComponent },
  { path: 'create', component: CardCreateComponent },
];

@NgModule({
  declarations: [
    CardListComponent,
    CardReviewComponent,
    CardCreateComponent,
    CardEditDialogComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDialogModule,
    RouterModule.forChild(routes),
  ],
})
export class CardsModule {}
