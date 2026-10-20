import { NavigationStart, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Component, Input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { TopbarService } from '../../common/services/topbar.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Sidebar } from '../sidebar/sidebar';
import { filter } from 'rxjs';

@Component({
  imports: [ToolbarModule, ButtonModule, RouterLink, NgTemplateOutlet],
  selector: 'app-topbar',
  styleUrl: './topbar.scss',
  templateUrl: './topbar.html',
})
export class Topbar {
  @Input() public sideBarRef!: Sidebar;

  public currentRoute: string = '/';

  constructor(
    private readonly _router: Router,
    public readonly topBarService: TopbarService,
  ) {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        this.currentRoute = event.url;
      });
  }
}
