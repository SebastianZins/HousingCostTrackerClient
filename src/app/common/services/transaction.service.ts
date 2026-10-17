import { Transaction } from '../models/transaction.model';
import { Injectable } from '@angular/core';

@Injectable()
export class TransactionService {
  private readonly STORAGE_KEY = 'transactions';

  public getTransactions(): Transaction[] {
    return this._getFromLocalStorage();
  }

  public upsertTransaction(transaction: Transaction): Transaction[] {
    let transactions = this._getFromLocalStorage();
    const foundTransaction = transactions.find((t) => t.id === transaction.id);
    if (foundTransaction) {
      const index = transactions.indexOf(foundTransaction);
      transactions[index] = transaction;
    } else {
      transactions.push(transaction);
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
    return transactions;
  }

  public deleteTransactions(transactionIds: string[]): Transaction[] {
    let transactions = this._getFromLocalStorage();
    transactionIds.forEach((id) => {
      transactions = transactions.filter((t) => t.id !== id);
    });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions));
    return transactions;
  }

  private _getFromLocalStorage(): Transaction[] {
    const transactionsJson = localStorage.getItem(this.STORAGE_KEY);
    if (transactionsJson) {
      return JSON.parse(transactionsJson) as Transaction[];
    }
    return [];
  }
}
