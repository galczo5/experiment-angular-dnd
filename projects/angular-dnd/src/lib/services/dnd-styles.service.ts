import {Injectable, Renderer2, RendererFactory2} from '@angular/core';
import {Position} from '../types/Position';
import {DndCss} from '../types/DndCss';
import {Size} from '../types/Size';

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

  setSize(el: HTMLElement, width: number, height: number): void {
    this.renderer.setStyle(el, 'width', width + 'px');
    this.renderer.setStyle(el, 'height', height + 'px');
  }

  setCloneStyles(el: HTMLElement): void {
    this.renderer.setStyle(el, 'pointer-events', 'none');
  }

  setCoverStyles(el: HTMLElement, size: Size, position: Position): void {
    this.renderer.setStyle(el, 'position', 'absolute');
    this.renderer.setStyle(el, 'width', size.width + 'px');
    this.renderer.setStyle(el, 'height', size.height + 'px');
    this.renderer.setStyle(el, 'top', position.y + 'px');
    this.renderer.setStyle(el, 'left', position.x + 'px');
  }

  addClass(el: HTMLElement, css: DndCss): void {
    this.renderer.addClass(el, css);
  }

  removeClass(el: HTMLElement, css: DndCss): void {
    this.renderer.removeClass(el, css);
  }
}
