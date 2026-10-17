import { ETransactionType } from '../enums/transaction-type.enum';

export class Transaction {
  id: string = crypto.randomUUID();
  date: number = new Date().setHours(0, 0, 0, 0);
  amount: number = 0;
  description?: string;
  place: string = '?';
  category?: string;
  payedBy: string = '?';
  payedTo?: string;
  transactionType: ETransactionType = ETransactionType.INCOME;
}
