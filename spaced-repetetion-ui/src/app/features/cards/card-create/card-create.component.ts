import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CardsService } from '../../../core/services/cards.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-card-create',
  templateUrl: './card-create.component.html',
  styleUrls: ['./card-create.component.scss'],
})
export class CardCreateComponent implements OnInit {
  cardForm: FormGroup;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  selectedTags: string[] = [];
  allTags: string[] = [];
  filteredTags: Observable<string[]>;
  isPreviewVisible = true;

  constructor(
    private fb: FormBuilder,
    private cardsService: CardsService,
    private router: Router
  ) {
    this.cardForm = this.fb.group({
      front: ['', Validators.required],
      back: ['', Validators.required],
    });

    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => this._filter(tag))
    );
  }

  ngOnInit(): void {
    // Get all existing tags from the service
    this.cardsService.getCards().subscribe((cards) => {
      const tagSet = new Set<string>();
      cards.forEach((card) => card.tags.forEach((tag) => tagSet.add(tag)));
      this.allTags = Array.from(tagSet).sort();
    });
  }

  private _filter(value: string | null): string[] {
    const filterValue = value?.toLowerCase() || '';
    return this.allTags.filter(
      (tag) =>
        tag.toLowerCase().includes(filterValue) &&
        !this.selectedTags.includes(tag)
    );
  }

  addTag(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      // Check if tag already exists
      if (!this.selectedTags.includes(value)) {
        this.selectedTags.push(value);

        // Add to allTags if it's a new tag
        if (!this.allTags.includes(value)) {
          this.allTags.push(value);
          this.allTags.sort();
        }
      }
    }

    // Clear the input value but don't blur
    event.chipInput!.clear();
    this.tagCtrl.setValue(null);

    // Keep focus on the input
    event.chipInput!.inputElement.focus();
  }

  removeTag(tag: string): void {
    const index = this.selectedTags.indexOf(tag);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  selectedTag(event: MatAutocompleteSelectedEvent): void {
    if (!this.selectedTags.includes(event.option.viewValue)) {
      this.selectedTags.push(event.option.viewValue);
    }

    // Clear the input value
    this.tagCtrl.setValue(null);

    // Keep focus on the input
    const input = document.querySelector(
      '.tag-input input'
    ) as HTMLInputElement;
    if (input) {
      input.focus();
    }
  }

  onSubmit(): void {
    if (this.cardForm.valid) {
      const cardData = {
        ...this.cardForm.value,
        tags: this.selectedTags,
      };

      this.cardsService.createCard(cardData).subscribe(() => {
        this.router.navigate(['..']);
      });
    }
  }

  togglePreview(): void {
    this.isPreviewVisible = !this.isPreviewVisible;
  }
}
