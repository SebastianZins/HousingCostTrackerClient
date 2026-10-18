import { ETransactionType } from '../enums/transaction-type.enum';
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

  public getTransactionTypeName(type: ETransactionType): string {
    switch (type) {
      case ETransactionType.EXPENSE:
        return 'Ausgabe';
      case ETransactionType.INCOME:
        return 'Einnahme';
      case ETransactionType.TRANSFER:
        return 'Übertrag';
      default:
        return '?';
    }
  }

  public getTransactionTypeNames(): { name: string; value: ETransactionType }[] {
    return [
      { name: 'Ausgabe', value: ETransactionType.EXPENSE },
      { name: 'Einnahme', value: ETransactionType.INCOME },
      { name: 'Übertrag', value: ETransactionType.TRANSFER },
    ];
  }
}
