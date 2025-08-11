import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionsService } from '../../services/transactions.service';
import { Transaction, TransactionType } from '../../models/transaction';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { FilterDropdownComponent } from '../../components/filter-dropdown/filter-dropdown.component';
import { TransactionsTableComponent } from '../../components/transactions-table/transactions-table.component';
import { PaginationControlsComponent } from '../../components/pagination-controls/pagination-controls.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    SearchBarComponent,
    FilterDropdownComponent,
    TransactionsTableComponent,
    PaginationControlsComponent,
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'] // corrected styleUrl to styleUrls
})
export class ReportsComponent {
  loading = true;
  error: string | null = null;

  all: Transaction[] = [];
  filtered: Transaction[] = [];
  pageItems: Transaction[] = [];

  searchTerm = '';
  type: 'All' | TransactionType = 'All';

  activeSort: string = 'date-desc';
  sortOptions: { value: string; viewValue: string }[] = [
    { value: 'date-desc', viewValue: 'Date: Newest First' },
    { value: 'date-asc', viewValue: 'Date: Oldest First' },
    { value: 'amount-desc', viewValue: 'Amount: High to Low' },
    { value: 'amount-asc', viewValue: 'Amount: Low to High' },
    { value: 'accountName-asc', viewValue: 'Account Name: A-Z' },
    { value: 'accountName-desc', viewValue: 'Account Name: Z-A' },
  ];

  pageIndex = 0;
  pageSize = 10;

  constructor(private txService: TransactionsService) {
    this.load();
  }

  load() {
    this.loading = true;
    this.error = null;
    this.txService.getTransactions().subscribe({
      next: (data) => {
        this.all = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load transactions.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  onSearch(term: string) {
    this.searchTerm = term.trim().toLowerCase();
    this.pageIndex = 0;
    this.applyFilters();
  }

  onTypeChange(type: 'All' | TransactionType) {
    this.type = type;
    this.pageIndex = 0;
    this.applyFilters();
  }

  onPageChange(index: number) {
    this.pageIndex = index;
    this.slicePage();
  }

  get activeSortLabel(): string {
    return this.sortOptions.find(o => o.value === this.activeSort)?.viewValue || 'Sort by';
  }

  onSortChange(sortValue: string) {
    this.activeSort = sortValue;
    this.applyFilters();
  }

  private applyFilters() {
    const term = this.searchTerm;
    this.filtered = this.all.filter((t) => {
      const matchesTerm = term ? t.accountName.toLowerCase().includes(term) : true;
      const matchesType = this.type === 'All' ? true : t.type === this.type;
      return matchesTerm && matchesType;
    });

    if (this.activeSort) {
      const [field, direction] = this.activeSort.split('-') as [keyof Transaction, 'asc' | 'desc'];
      const dir = direction === 'asc' ? 1 : -1;
      this.filtered.sort((a, b) => {
        const valA = (a as any)[field];
        const valB = (b as any)[field];

        if (field === 'date') {
          return (new Date(valA).getTime() - new Date(valB).getTime()) * dir;
        }

        if (typeof valA === 'string' && typeof valB === 'string') {
          return valA.localeCompare(valB) * dir;
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
          return (valA - valB) * dir;
        }

        return 0;
      });
    }

    this.slicePage();
  }

  private slicePage() {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pageItems = this.filtered.slice(start, end);
  }
}
