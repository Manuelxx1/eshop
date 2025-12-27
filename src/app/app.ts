import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { WsTestComponent } from './components/ws-test-component/ws-test-component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterModule, CommonModule, WsTestComponent  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('eshop');
  title = 'Mi App Angular con WebSocket';
}
