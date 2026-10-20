import { ETransactionType } from '../enums/transaction-type.enum';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Transaction } from '../models/transaction.model';
import { transactions } from '../../testData/transaction';
import { AppConstants } from '../../app.constants';
import { HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';

@Injectable()
export class TransactionService {
  constructor(
    private _httpService: HttpService,
    private _localStorageService: LocalStorageService,
    private _configService: ConfigService,
  ) {
    this._loadTestData();
  }

  private _loadTestData(): void {
    this._configService.waitForLoadingTestData().subscribe((load) => {
      if (load) {
        localStorage.setItem(
          AppConstants.LOCAL_STORAGE_KEY_TRANSACTION,
          JSON.stringify(transactions),
        );
      }
    });
  }

  public getTransactions(): Observable<Transaction[]> {
    return this._configService.waitForApiCheck().pipe(
      switchMap((exists) => {
        if (exists) {
          return this._httpService.get<Transaction[]>(AppConstants.END_PNT_TRANSACTION_GET_ALL);
        } else {
          return this._localStorageService.getAll<Transaction>(
            AppConstants.LOCAL_STORAGE_KEY_TRANSACTION,
          );
        }
      }),
    );
  }

  public upsertTransaction(transaction: Transaction): Observable<boolean> {
    return this._configService.waitForApiCheck().pipe(
      switchMap((exists) => {
        if (exists) {
          return this._httpService.post<boolean>(AppConstants.END_PNT_TRANSACTION, transaction);
        } else {
          return this._localStorageService.upsert(
            AppConstants.LOCAL_STORAGE_KEY_TRANSACTION,
            transaction,
            'id',
          );
        }
      }),
    );
  }

  public deleteTransaction(id: string): Observable<boolean> {
    return this._configService.waitForApiCheck().pipe(
      switchMap((exists) => {
        if (exists) {
          const params = new HttpParams().set('id', id);
          return this._httpService.delete(AppConstants.END_PNT_TRANSACTION, params).pipe(
            map(() => true),
            catchError(() => of(false)),
          );
        } else {
          return this._localStorageService.delete(
            AppConstants.LOCAL_STORAGE_KEY_TRANSACTION,
            'id',
            id,
          );
        }
      }),
    );
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
