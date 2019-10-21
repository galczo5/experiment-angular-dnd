import {Size} from './Size';

export enum CloneState {
  NONE,
  NEW,
  IN_USE,
  DESTROYED
}

export class DndClone {

  private state: CloneState = CloneState.NEW;

  constructor(private readonly el: HTMLElement,
              private readonly size: Size) {
  }

  getElement(): HTMLElement {
    return this.el;
  }

  getSize(): Size {
    return this.size;
  }

  getState(): CloneState {
    return this.state;
  }

  setState(state: CloneState): void {
    this.state = state;
  }

}
