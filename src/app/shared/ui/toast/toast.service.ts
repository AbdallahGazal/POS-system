import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly messagesState = signal<ToastMessage[]>([]);
  private nextId = 1;

  readonly messages = this.messagesState.asReadonly();

  success(message: string): void {
    this.show('success', message);
  }

  error(message: string): void {
    this.show('error', message);
  }

  info(message: string): void {
    this.show('info', message);
  }

  dismiss(id: number): void {
    this.messagesState.update((messages) => messages.filter((message) => message.id !== id));
  }

  private show(type: ToastType, message: string): void {
    const toast = { id: this.nextId++, type, message };
    this.messagesState.update((messages) => [...messages, toast]);
    window.setTimeout(() => this.dismiss(toast.id), 3500);
  }
}
