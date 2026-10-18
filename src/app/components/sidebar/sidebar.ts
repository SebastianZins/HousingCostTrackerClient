import { Component, signal } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';

@Component({
  imports: [DrawerModule, ButtonModule],
  selector: 'app-sidebar',
  styleUrl: './sidebar.scss',
  templateUrl: './sidebar.html',
})
export class Sidebar {
  public visible = signal<boolean>(false);

  public toggleSidebar() {
    this.visible.set(!this.visible());
  }
}
