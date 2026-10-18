import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { Injectable, signal, TemplateRef } from '@angular/core';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TopbarService {
  public readonly headerTemplate = signal<TemplateRef<unknown> | undefined>(undefined);

  constructor(private _router: Router) {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(),
      )
      .subscribe((_) => {
        this.headerTemplate.set(undefined);
      });
  }
}
