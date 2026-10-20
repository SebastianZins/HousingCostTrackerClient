import {
  BehaviorSubject,
  catchError,
  Observable,
  switchMap,
  filter,
  race,
  take,
  map,
  of,
} from 'rxjs';
import { AppConstants } from '../../app.constants';
import { Injectable, signal } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  public apiChecked = new BehaviorSubject<boolean>(false);
  public apiReachable = false;
  public useTestData = new BehaviorSubject<boolean | null>(null);
  public useTestDataDialogShown = signal<boolean>(false);

  constructor(private _httpService: HttpService) {
    this._check();
  }

  private _check(): void {
    this._httpService
      .get(AppConstants.END_PNT_HEALTH)
      .pipe(
        map(() => true),
        catchError(() => of(false)),
      )
      .subscribe((ok) => {
        this.apiReachable = ok;
        this.apiChecked.next(true);
      });
  }

  public waitForApiCheck(): Observable<boolean> {
    return this.apiChecked.asObservable().pipe(
      filter((val) => !!val),
      take(1),
      switchMap(() => {
        if (!this.apiReachable && this.useTestData.value === null) {
          this.useTestDataDialogShown.set(true);
          return this.useTestData
            .pipe(
              filter((val) => !!val),
              take(1),
            )
            .pipe(map(() => this.apiReachable));
        } else {
          return of(this.apiReachable);
        }
      }),
    );
  }

  public waitForLoadingTestData(): Observable<boolean> {
    const apiReachable = this.apiChecked.asObservable().pipe(
      filter((val) => !!val && !!this.apiReachable),
      take(1),
      map(() => false),
    );

    const useTestData = this.useTestData.asObservable().pipe(
      filter((val) => val !== null),
      take(1),
      map((val) => {
        return val;
      }),
    );

    return race([apiReachable, useTestData]);
  }
}
