import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Internal imports
import { IPeriodicElement } from '../../model/IPeriodicElement.model';
import { PeriodicElementListState } from '../../store/PeriodicElementList.store';

@Component({
  selector: 'app-periodic-element-edit-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './periodic-element-edit-dialog.html',
  styleUrl: './periodic-element-edit-dialog.scss',
})
export class PeriodicElementEditDialog {
  protected readonly dialogRef = inject(
    MatDialogRef<PeriodicElementEditDialog>
  );
  protected readonly data = inject<IPeriodicElement>(MAT_DIALOG_DATA);
  protected readonly fb = inject(FormBuilder);
  protected readonly pertiodicTableStore = inject(PeriodicElementListState);

  protected readonly form = this.fb.nonNullable.group({
    position: [this.data.position],
    name: [this.data.name, Validators.required],
    weight: [this.data.weight, [Validators.required, Validators.min(0)]],
    symbol: [this.data.symbol, Validators.required],
  });

  onNoClick(): void {
    this.dialogRef.close();
  }

  handleDataSaveClick(): void {
    this.markFormGroupTouched(this.form);

    if (!this.form.valid) return;

    this.pertiodicTableStore.updateElement(this.form.getRawValue());
    this.dialogRef.close();
  }

  // TODO: move it to separate utils service
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsDirty();
      control.markAsTouched();
      control.updateValueAndValidity();
    });
  }
}
