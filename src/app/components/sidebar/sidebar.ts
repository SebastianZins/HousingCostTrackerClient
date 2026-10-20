import { NavigationStart, Router} from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, signal } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';
import { filter } from 'rxjs';

@Component({
  imports: [DrawerModule, ButtonModule, DividerModule],
  selector: 'app-sidebar',
  styleUrl: './sidebar.scss',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  public visible = signal<boolean>(false);
  public currentRoute: string = '/';

  constructor(private readonly _router: Router) {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        this.currentRoute = event.url;
      });
  }

  public toggleSidebar(): void {
    this.visible.set(!this.visible());
  }

  public navigate(route: string): void {
    this.visible.set(false);
    this._router.navigate([route]);
  }
}
