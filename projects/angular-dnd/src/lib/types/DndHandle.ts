import {Subscription} from 'rxjs';

export class DndHandle {
  constructor(private readonly el: HTMLElement,
              private listener: Subscription) {
  }

  getElement(): HTMLElement {
    return this.el;
  }

  getListener(): Subscription {
    return this.listener;
  }
}
