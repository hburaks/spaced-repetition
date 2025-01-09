import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Card } from '../../../core/models/card.models';
import { TagService } from '../../../core/services/tag.service';

@Component({
  selector: 'app-card-edit-dialog',
  templateUrl: './card-edit-dialog.component.html',
  styleUrls: ['./card-edit-dialog.component.scss'],
})
export class CardEditDialogComponent implements OnInit {
  cardForm: FormGroup;
  tagInput = new FormControl('');
  selectedTags: string[] = [];
  filteredTags: Observable<string[]> = of([]);
  availableTags: string[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CardEditDialogComponent>,
    private tagService: TagService,
    @Inject(MAT_DIALOG_DATA) public data: Card
  ) {
    this.cardForm = this.fb.group({
      front: [data.front, Validators.required],
      back: [data.back, Validators.required],
    });
    this.selectedTags = [...data.tags];
  }

  ngOnInit() {
    this.loadTags();
    this.setupTagAutocomplete();
  }

  private loadTags() {
    this.tagService.getUserTags().subscribe((tags) => {
      this.availableTags = tags;
    });
  }

  private setupTagAutocomplete() {
    this.filteredTags = this.tagInput.valueChanges.pipe(
      startWith(''),
      map((value) => this.filterTags(value || ''))
    );
  }

  private filterTags(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.availableTags.filter(
      (tag) =>
        tag.toLowerCase().includes(filterValue) &&
        !this.selectedTags.includes(tag)
    );
  }

  addTag(event: any) {
    const value = event.option.value;
    if (value && !this.selectedTags.includes(value)) {
      this.selectedTags.push(value);
    }
    this.tagInput.setValue('');
  }

  removeTag(tag: string) {
    const index = this.selectedTags.indexOf(tag);
    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  onSave() {
    if (this.cardForm.valid) {
      const result = {
        ...this.cardForm.value,
        tags: this.selectedTags,
      };
      this.dialogRef.close(result);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
