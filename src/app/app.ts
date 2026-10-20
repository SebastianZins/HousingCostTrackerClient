import { ConfigService } from './common/services/config.service';
import { Sidebar } from './components/sidebar/sidebar';
import { Topbar } from './components/topbar/topbar';
import { RouterOutlet } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Component } from '@angular/core';

@Component({
  imports: [RouterOutlet, Sidebar, Topbar, ToastModule, DialogModule, ButtonModule],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  constructor(public readonly configService: ConfigService) {}
}
