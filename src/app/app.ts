import { Sidebar } from './components/sidebar/sidebar';
import { Topbar } from './components/topbar/topbar';
import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  imports: [RouterOutlet, Sidebar, Topbar],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {}
