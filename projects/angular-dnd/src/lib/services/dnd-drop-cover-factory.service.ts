import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {DndStylesService} from './dnd-styles.service';

declare var window: Window;

@Injectable({
  providedIn: 'root'
})
export class DndDropCoverFactoryService {

  constructor(@Inject(DOCUMENT) private readonly document: any,
              private readonly stylesService: DndStylesService) {
  }

  createCover(el: HTMLElement): HTMLElement {
    const coverEl = document.createElement('div');
    const rect = el.getBoundingClientRect();

    this.stylesService.setCoverStyles(coverEl, rect, {
      y: rect.top + window.scrollY,
      x: rect.left + window.scrollX
    });

    this.document.body.appendChild(coverEl);
    return coverEl;
  }

  destroyCover(cover: HTMLElement): void {
    cover.remove();
  }
}
