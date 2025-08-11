import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private readonly url = 'assets/transactions.json';

  constructor(private http: HttpClient) {}

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.url).pipe(
      map(items =>
        items.map(it => ({
          ...it,
          amount: Number(it.amount),
        }))
      )
    );
  }
}
