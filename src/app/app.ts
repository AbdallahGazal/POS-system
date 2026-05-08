import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavComponent } from './layouts/nav/nav.component';
import { ToastComponent } from './shared/ui/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
