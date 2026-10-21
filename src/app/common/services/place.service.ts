import { Observable, switchMap, map, catchError, of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { AppConstants } from '../../app.constants';
import { HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { places } from '../../testData/places';
import { Place } from '../models/place.model';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PlaceService {
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
        localStorage.setItem(AppConstants.LOCAL_STORAGE_KEY_PLACE, JSON.stringify(places));
      }
    });
  }

  public getPlaces(): Observable<Place[]> {
    return this._configService.waitForApiCheck().pipe(
      switchMap((exists) => {
        if (exists) {
          return this._httpService.get<Place[]>(AppConstants.END_PNT_PLACE_GET_ALL);
        } else {
          return this._localStorageService.getAll<Place>(AppConstants.LOCAL_STORAGE_KEY_PLACE);
        }
      }),
    );
  }

  public upsertPlace(place: Place): Observable<boolean> {
    return this._configService.waitForApiCheck().pipe(
      switchMap((exists) => {
        if (exists) {
          return this._httpService.post<boolean>(AppConstants.END_PNT_PLACE, place);
        } else {
          return this._localStorageService.upsert(
            AppConstants.LOCAL_STORAGE_KEY_PLACE,
            place,
            'id',
          );
        }
      }),
    );
  }

  public deletePlace(id: string): Observable<boolean> {
    return this._configService.waitForApiCheck().pipe(
      switchMap((exists) => {
        if (exists) {
          const params = new HttpParams().set('id', id);
          return this._httpService.delete(AppConstants.END_PNT_PLACE, params).pipe(
            map(() => true),
            catchError(() => of(false)),
          );
        } else {
          return this._localStorageService.delete(AppConstants.LOCAL_STORAGE_KEY_PLACE, 'id', id);
        }
      }),
    );
  }
}
