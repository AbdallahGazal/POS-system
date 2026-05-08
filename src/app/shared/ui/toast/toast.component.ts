import { Component } from '@angular/core';

import { ToastService, ToastType } from './toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  constructor(readonly toast: ToastService) {}

  toastClasses(type: ToastType): string {
    const base = 'pointer-events-auto rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-black/5';
    const variants: Record<ToastType, string> = {
      success: 'bg-emerald-500',
      error: 'bg-red-500',
      info: 'bg-blue-600',
    };

    return `${base} ${variants[type]}`;
  }
}
