import { Component, Input, inject } from '@angular/core';
import { CommonModule, AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Transaction } from '../../models/transaction';

@Component({
  selector: 'app-transactions-table',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    DatePipe,
    DecimalPipe,
    MatTableModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './transactions-table.component.html',
  styleUrls: ['./transactions-table.component.scss']
})
export class TransactionsTableComponent {
  @Input() data: Transaction[] = [];

  private breakpointObserver = inject(BreakpointObserver);



  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  displayedColumns: string[] = [
    'id',
    'date',
    'voucherNo',
    'accountId',
    'accountName',
    'branch',
    'type',
    'amount',
  ];



}
