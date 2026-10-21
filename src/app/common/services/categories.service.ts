import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { categories } from '../../testData/categories';
import { Category } from '../models/category.models';
import { AppConstants } from '../../app.constants';
import { HttpParams } from '@angular/common/http';
import { ConfigService } from './config.service';
import { HttpService } from './http.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoryService {
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
        localStorage.setItem(AppConstants.LOCAL_STORAGE_KEY_CATEGORY, JSON.stringify(categories));
      }
    });
  }

  public getCategories(): Observable<Category[]> {
    return this._configService.waitForApiCheck().pipe(
      switchMap((exists) => {
        if (exists) {
          return this._httpService.get<Category[]>(AppConstants.END_PNT_CATEGORY_GET_ALL);
        } else {
          return this._localStorageService.getAll<Category>(
            AppConstants.LOCAL_STORAGE_KEY_CATEGORY,
          );
        }
      }),
    );
  }

  public upsertCategory(category: Category): Observable<boolean> {
    return this._configService.waitForApiCheck().pipe(
      switchMap((exists) => {
        if (exists) {
          return this._httpService.post<boolean>(AppConstants.END_PNT_CATEGORY, category);
        } else {
          return this._localStorageService.upsert(
            AppConstants.LOCAL_STORAGE_KEY_CATEGORY,
            category,
            'id',
          );
        }
      }),
    );
  }

  public deleteCategory(id: string): Observable<boolean> {
    return this._configService.waitForApiCheck().pipe(
      switchMap((exists) => {
        if (exists) {
          const params = new HttpParams().set('id', id);
          return this._httpService.delete(AppConstants.END_PNT_CATEGORY, params).pipe(
            map(() => true),
            catchError(() => of(false)),
          );
        } else {
          return this._localStorageService.delete(
            AppConstants.LOCAL_STORAGE_KEY_CATEGORY,
            'id',
            id,
          );
        }
      }),
    );
  }
}
