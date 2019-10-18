import {Inject, Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {DndStylesService} from './dnd-styles.service';
import {Position} from '../types/Position';
import {DndCss} from '../types/DndCss';

@Injectable({
  providedIn: 'root'
})
export class DndCloneService {

  private clone: HTMLElement;
  private readonly renderer: Renderer2;

  constructor(@Inject(DOCUMENT) private readonly document: Document,
              rendererFactory2: RendererFactory2,
              private readonly stylesService: DndStylesService) {
    this.renderer = rendererFactory2.createRenderer(null, null);
  }

  createClone(el: HTMLElement): void {
    const { width, height } = el.getBoundingClientRect();
    this.clone = this.document.createElement('div');

    this.stylesService.setCloneStyles(this.clone);
    this.stylesService.setSize(this.clone, width, height);
    this.stylesService.addClass(this.clone, DndCss.DRAG_ACTIVE);

    this.clone.appendChild(el.cloneNode(true));
    this.document.body.appendChild(this.clone);
  }

  setPosition(position: Position): void {
    this.stylesService.setPosition(this.clone, position);
  }

  destroyClone(): void {
    this.clone.remove();
  }
}
