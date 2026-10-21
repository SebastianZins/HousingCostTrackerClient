import { Observable, switchMap, map, catchError, of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { IPerson } from '../interfaces/person.interface';
import { AppConstants } from '../../app.constants';
import { HttpParams } from '@angular/common/http';
import { persons } from '../../testData/persons';
import { ConfigService } from './config.service';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PersonService {
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
        localStorage.setItem(AppConstants.LOCAL_STORAGE_KEY_PERSON, JSON.stringify(persons));
      }
    });
  }

  public getPersons(): Observable<IPerson[]> {
    return this._configService.waitForApiCheck().pipe(
      switchMap((exists) => {
        if (exists) {
          return this._httpService.get<IPerson[]>(AppConstants.END_PNT_PERSON_GET_ALL);
        } else {
          return this._localStorageService.getAll<IPerson>(AppConstants.LOCAL_STORAGE_KEY_PERSON);
        }
      }),
    );
  }

  public upsertPerson(person: IPerson): Observable<boolean> {
    return this._configService.waitForApiCheck().pipe(
      switchMap((exists) => {
        if (exists) {
          return this._httpService.post<boolean>(AppConstants.END_PNT_PERSON, person);
        } else {
          return this._localStorageService.upsert(
            AppConstants.LOCAL_STORAGE_KEY_PERSON,
            person,
            'id',
          );
        }
      }),
    );
  }

  public deletePerson(id: string): Observable<boolean> {
    return this._configService.waitForApiCheck().pipe(
      switchMap((exists) => {
        if (exists) {
          const params = new HttpParams().set('id', id);
          return this._httpService.delete(AppConstants.END_PNT_PERSON, params).pipe(
            map(() => true),
            catchError(() => of(false)),
          );
        } else {
          return this._localStorageService.delete(AppConstants.LOCAL_STORAGE_KEY_PERSON, 'id', id);
        }
      }),
    );
  }
}
