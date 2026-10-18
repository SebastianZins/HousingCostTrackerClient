import { NavigationStart, Router, RouterLink } from '@angular/router';
import { Component, Input } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Sidebar } from '../sidebar/sidebar';
import { filter } from 'rxjs';

@Component({
  imports: [ToolbarModule, ButtonModule, RouterLink],
  selector: 'app-topbar',
  styleUrl: './topbar.scss',
  templateUrl: './topbar.html',
})
export class Topbar {
  @Input() public sideBarRef!: Sidebar;

  public currentRoute: string = '/';

  constructor(private readonly _router: Router) {
    this._router.events
      .pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event) => {
        this.currentRoute = event.url;
      });
  }
}
