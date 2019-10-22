import {Inject, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {DndStylesService} from './dnd-styles.service';
import {Position} from '../types/Position';
import {DndCss} from '../types/DndCss';
import {CloneState, DndClone} from '../types/DndClone';

@Injectable({
  providedIn: 'root'
})
export class DndCloneService {

  private readonly renderer: Renderer2;
  private clone: DndClone;

  constructor(@Inject(DOCUMENT) private readonly document: Document,
              rendererFactory2: RendererFactory2,
              private readonly stylesService: DndStylesService) {
    this.renderer = rendererFactory2.createRenderer(null, null);
  }

  createClone(el: HTMLElement): void {
    const size = el.getBoundingClientRect();
    const cloneEl = this.document.createElement('div');
    this.clone = new DndClone(cloneEl, size);

    this.setStyles();

    cloneEl.appendChild(el.cloneNode(true));
    this.document.body.appendChild(cloneEl);
  }

  setPosition(position: Position): void {
    this.stylesService.setPosition(this.clone.getElement(), position);
    this.setCloneVisibility();
  }

  destroyClone(): void {
    this.clone.getElement().remove();
    this.clone.setState(CloneState.DESTROYED);
  }

  private setCloneVisibility(): void {
    if (this.clone.getState() === CloneState.NEW) {
      this.stylesService.setCloneVisibility(this.clone.getElement(), true);
      this.clone.setState(CloneState.IN_USE);
    }
  }

  private setStyles(): void {
    const el = this.clone.getElement();
    const size = this.clone.getSize();

    this.stylesService.setCloneStyles(el);
    this.stylesService.setCloneVisibility(el, false);
    this.stylesService.setSize(el, size.width, size.height);
    this.stylesService.addClass(el, DndCss.DRAG_ACTIVE);
  }
}
