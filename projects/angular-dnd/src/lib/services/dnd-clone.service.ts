import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {DndStylesService} from './dnd-styles.service';
import {Position} from '../types/Position';
import {DndCss} from '../types/DndCss';
import {CloneState, DndClone} from '../types/DndClone';
import {DragGroup} from '../types/DragGroup';

declare var window: Window;

@Injectable({
  providedIn: 'root'
})
export class DndCloneService {

  private clone: DndClone;
  private group: DragGroup;

  constructor(@Inject(DOCUMENT) private readonly document: any,
              private readonly stylesService: DndStylesService) {
  }

  createClone(el: HTMLElement, position: Position, group: DragGroup): void {
    const size = el.getBoundingClientRect();
    const cloneEl = this.document.createElement('div');

    this.clone = new DndClone(cloneEl, size);
    this.group = group;

    this.setStyles();
    this.setPosition(position);

    cloneEl.appendChild(el.cloneNode(true));
    this.document.body.appendChild(cloneEl);
  }

  setPosition(position: Position): void {
    this.stylesService.setPosition(this.clone.getElement(), {
      y: position.y + window.scrollY,
      x: position.x + window.scrollX
    });
  }

  destroyClone(): void {
    this.clone.getElement().remove();
    this.clone.setState(CloneState.DESTROYED);
  }

  private setStyles(): void {
    const el = this.clone.getElement();
    const size = this.clone.getSize();

    this.stylesService.setCloneStyles(el);
    this.stylesService.setSize(el, size.width, size.height);
    this.stylesService.addClass(el, DndCss.DRAG_ACTIVE);
    this.stylesService.addClass(el, this.getGroupClassName());
  }

  private getGroupClassName(): string {
    return DndCss.DRAG_ACTIVE + '-' + this.group;
  }
}
