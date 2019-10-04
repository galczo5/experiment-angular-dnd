import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {Position} from '../types/Position';
import {DndCss} from '../types/DndCss';

@Injectable({
  providedIn: 'root'
})
export class DndStylesService {

  private readonly renderer: Renderer2;

  constructor(rendererFactory2: RendererFactory2) {
    this.renderer = rendererFactory2.createRenderer(null, null);
  }

  setHandleStyles(dragHandle: HTMLElement): void {
    this.renderer.setStyle(dragHandle, 'cursor', 'move');
    this.renderer.setStyle(dragHandle, 'user-select', 'none');
  }

  resetHandleStyles(dragHandle: HTMLElement): void {
    this.renderer.removeStyle(dragHandle, 'cursor');
    this.renderer.removeStyle(dragHandle, 'user-select');
  }

  setPosition(el: HTMLElement, position: Position): void {
    this.renderer.setStyle(el, 'position', 'absolute');
    this.renderer.setStyle(el, 'top', '0');
    this.renderer.setStyle(el, 'left', '0');
    this.renderer.setStyle(el, 'transform', `translateY(${position.y}px) translateX(${position.x}px)`);
  }

  resetPosition(el: HTMLElement): void {
    this.renderer.removeStyle(el, 'position');
    this.renderer.removeStyle(el, 'top');
    this.renderer.removeStyle(el, 'left');
    this.renderer.removeStyle(el, 'transform');
  }

  addClass(el: HTMLElement, css: DndCss): void {
    this.renderer.addClass(el, css);
  }

  removeClass(el: HTMLElement, css: DndCss): void {
    this.renderer.removeClass(el, css);
  }
}
