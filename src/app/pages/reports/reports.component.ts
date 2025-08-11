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
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

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
  styleUrls: ['./reports.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter',
          [style({ opacity: 0, transform: 'translateY(-20px)' }), stagger('50ms', animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })))],
          { optional: true }
        )
      ])
    ])
  ] 
})
export class ReportsComponent {
  loading = true;
  error: string | null = null;

  all: Transaction[] = [];
  filtered: Transaction[] = [];
  pageItems: Transaction[] = [];

  searchTerm = '';
  type: 'All' | TransactionType = 'All';

  sortOptions = [
    { value: 'amount-desc', viewValue: 'Highest Amount', icon: 'attach_money' },
    { value: 'amount-asc', viewValue: 'Lowest Amount', icon: 'attach_money' }
  ];
  activeSort = 'date-desc';
  activeSortLabel = 'Newest First';
  activeSortIcon = 'update';

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
    this.searchTerm = term;
    this.applyFilters();
    this.applySorting();
  }

  onTypeChange(type: 'All' | TransactionType) {
    this.type = type;
    this.applyFilters();
    this.applySorting();
  }

  onPageChange(index: number) {
    this.pageIndex = index;
    this.slicePage();
  }

  // Method to apply sorting based on active sort option
  private applySorting() {
    if (!this.filtered) return;

    const [field, direction] = this.activeSort.split('-');
    const isDesc = direction === 'desc';

    this.filtered = [...this.filtered].sort((a, b) => {
      let valueA, valueB;

      if (field === 'date') {
        valueA = new Date(a.date).getTime();
        valueB = new Date(b.date).getTime();
      } else if (field === 'amount') {
        valueA = a.amount;
        valueB = b.amount;
      } else {
        return 0;
      }

      if (valueA < valueB) {
        return isDesc ? 1 : -1;
      }
      if (valueA > valueB) {
        return isDesc ? -1 : 1;
      }
      return 0;
    });

    this.slicePage();
  }

  onSortChange(sortBy: string) {
    this.activeSort = sortBy;
    const selectedOption = this.sortOptions.find(option => option.value === sortBy);
    if (selectedOption) {
      this.activeSortLabel = selectedOption.viewValue;
      this.activeSortIcon = selectedOption.icon;
    }
    this.applySorting();
  }

  clearFilters() {
    this.searchTerm = '';
    this.type = 'All';
    this.activeSort = 'date-desc';
    this.activeSortLabel = 'Newest First';
    this.activeSortIcon = 'update';
    this.pageIndex = 0;
    this.applyFilters();
  }

  loadTransactions() {
    this.loading = true;
    this.error = null;
    this.txService.getTransactions().subscribe({
      next: (data) => {
        this.all = data;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load transactions. Please try again.';
        console.error('Error loading transactions:', err);
        this.loading = false;
      }
    });
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
    this.updateSummaryStats();
  }

  totalCredit = 0;
  totalDebit = 0;

  private updateSummaryStats() {
    this.totalCredit = this.filtered
      .filter(t => t.type === 'Credit')
      .reduce((sum, t) => sum + t.amount, 0);
    this.totalDebit = this.filtered
      .filter(t => t.type === 'Debit')
      .reduce((sum, t) => sum + t.amount, 0);
  }
}
