import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter-dropdown',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatIconModule],
  templateUrl: './filter-dropdown.component.html',
  styleUrls: ['./filter-dropdown.component.scss']
})
export class FilterDropdownComponent {
  @Output() typeChange = new EventEmitter<'All' | 'Debit' | 'Credit'>();

  selected: 'All' | 'Debit' | 'Credit' = 'All';

  onChange(value: 'All' | 'Debit' | 'Credit') {
    this.selected = value;
    this.typeChange.emit(value);
  }
}
