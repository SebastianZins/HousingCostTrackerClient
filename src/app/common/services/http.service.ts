import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MessageService } from 'primeng/api';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(
    private readonly _http: HttpClient,
    private readonly _messageService: MessageService,
  ) {}

  public get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.request<T>('GET', endpoint, undefined, params);
  }

  public post<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    params?: HttpParams,
  ): Observable<TResponse> {
    return this.request<TResponse>('POST', endpoint, body, params);
  }

  public put<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    params?: HttpParams,
  ): Observable<TResponse> {
    return this.request<TResponse>('PUT', endpoint, body, params);
  }

  public patch<TResponse, TBody = unknown>(
    endpoint: string,
    body: TBody,
    params?: HttpParams,
  ): Observable<TResponse> {
    return this.request<TResponse>('PATCH', endpoint, body, params);
  }

  public delete<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.request<T>('DELETE', endpoint, undefined, params);
  }

  private request<T>(
    method: string,
    endpoint: string,
    body?: unknown,
    params?: HttpParams,
  ): Observable<T> {
    const path = endpoint.replace(/^\/+/, '');
    const url = `${environment.apiUrl}/${path}`;
    return this._http
      .request<T>(method, url, {
        body,
        params,
      })
      .pipe(catchError((error: unknown) => this.handleError(error)));
  }

  private handleError(error: unknown): Observable<never> {
    const detail = this.getGenericErrorMessage(error);

    this._messageService.add({
      severity: 'error',
      summary: 'Fehler',
      detail,
      life: 5000,
    });

    return throwError(() => error);
  }

  private getGenericErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && error.status === 0) {
      return 'Der Server ist momentan nicht erreichbar. Bitte versuche es später erneut.';
    }

    return 'Ein unerwarteter Fehler ist aufgetreten. Bitte versuche es erneut.';
  }
}
