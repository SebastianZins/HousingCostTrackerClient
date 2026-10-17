import { Component, Input } from '@angular/core';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { Sidebar } from '../sidebar/sidebar';

@Component({
  imports: [ToolbarModule, ButtonModule],
  selector: 'app-topbar',
  styleUrl: './topbar.scss',
  templateUrl: './topbar.html',
})
export class Topbar {
  @Input() public sideBarRef!: Sidebar;
}
