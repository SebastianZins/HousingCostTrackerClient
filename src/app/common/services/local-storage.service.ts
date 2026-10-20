import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(private readonly _messageService: MessageService) {}

  public getAll<T>(key: string): Observable<T[]> {
    const dataString = localStorage.getItem(key);
    if (!dataString) {
      return this._handleError(`Sammlung ${key} nicht gefunden`);
    }
    const data = JSON.parse(dataString) as T[];
    return of(data);
  }

  public get<T>(key: string, idPropName: string, idValue: any): Observable<T | undefined> {
    return this.getAll<T>(key).pipe(
      switchMap((data) => {
        const foundData = data.find((d) => (d as any)[idPropName] === idValue);
        return of(foundData);
      }),
    );
  }

  public upsert<T>(key: string, item: T, idPropName: string): Observable<boolean> {
    return this.getAll<T>(key).pipe(
      switchMap((data) => {
        const foundIndex = data.findIndex(
          (d) => (d as any)[idPropName] === (item as any)[idPropName],
        );
        // update
        if (foundIndex !== -1) {
          data[foundIndex] = item;
        }
        // insert
        else {
          data.push(item);
        }
        localStorage.setItem(key, JSON.stringify(data));
        return of(true);
      }),
      catchError(() => of(false)),
    );
  }

  public delete<T>(key: string, idPropName: string, idValue: any): Observable<boolean> {
    return this.getAll<T>(key).pipe(
      switchMap((data) => {
        const foundIndex = data.findIndex((d) => (d as any)[idPropName] === idValue);
        // found => delete
        if (foundIndex !== -1) {
          data.splice(foundIndex, 1);
          localStorage.setItem(key, JSON.stringify(data));
        }
        return of(true);
      }),
      catchError(() => of(false)),
    );
  }

  private _handleError(error: unknown): Observable<never> {
    const detail = this._getGenericErrorMessage(error);

    this._messageService.add({
      severity: 'error',
      summary: 'Fehler',
      detail,
      life: 5000,
    });

    return throwError(() => error);
  }

  private _getGenericErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && error.status === 0) {
      return 'Der Server ist momentan nicht erreichbar. Bitte versuche es später erneut.';
    } else if (error instanceof String && error.length > 0) {
      return error as string;
    }

    return 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.';
  }
}
