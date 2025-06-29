import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

// Internal Imports
import {
  IPeriodicElementListState,
  PeriodicElementListState,
} from '../../store/PeriodicElementList.store';
import { PeriodicElementEditDialog } from '../../dialog/periodic-element-edit-dialog/periodic-element-edit-dialog';

@Component({
  selector: 'app-periodic-table.view',
  imports: [
    MatTableModule,
    MatProgressSpinner,
    MatFormField,
    MatLabel,
    MatInput,
    MatIconButton,
    MatIcon,
  ],
  templateUrl: './periodic-table.view.html',
  styleUrl: './periodic-table.view.scss',
})
export default class PeriodicTableView {
  protected readonly pertiodicTableStore = inject(PeriodicElementListState);
  protected readonly dialog = inject(MatDialog);

  protected readonly displayedColumns: string[] = [
    'demo-position',
    'demo-name',
    'demo-weight',
    'demo-symbol',
    'actions',
  ];

  protected handleFilterValueChange(e: Event) {
    if (!(e.target instanceof HTMLInputElement)) return;
    this.pertiodicTableStore.setFilter(e.target.value);
  }

  protected handleEditClick(elementToEdit: IPeriodicElementListState) {
    this.dialog.open(PeriodicElementEditDialog, {
      data: elementToEdit,
    });
  }
}
