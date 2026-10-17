import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';

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
