export type TransactionType = 'Debit' | 'Credit';

export interface Transaction {
  id: number;
  date: string; 
  voucherNo: string;
  accountId: string;
  accountName: string;
  branch: string;
  type: TransactionType;
  amount: number;
}
