import {Directive, ElementRef, Inject, Input, NgZone, OnInit} from '@angular/core';
import {DndEventsService} from '../services/dnd-events.service';
import {DndStoreService} from '../services/dnd-store.service';
import {fromEvent, Subject, Subscription} from 'rxjs';
import {DOCUMENT} from '@angular/common';
import {takeUntil} from 'rxjs/operators';
import {Position} from '../types/Position';

import {DndEvent} from '../types/DndEvents';
import {DndStylesService} from '../services/dnd-styles.service';
import {DndCss} from '../types/DndCss';
import {DragData} from '../types/DragData';

@Directive({
  selector: '[dndDrag]'
})
export class DragDirective implements OnInit {

  @Input('dndDrag')
  data: DragData;

  private dragHandle: HTMLElement;
  private dragStartListener: Subscription;
  private readonly nativeElement: HTMLElement;
  private readonly drag$: Subject<void> = new Subject<void>();

  constructor(private readonly zone: NgZone,
              private readonly eventsService: DndEventsService,
              private readonly storeService: DndStoreService,
              private readonly stylesService: DndStylesService,
              @Inject(DOCUMENT) private readonly document: Document,
              el: ElementRef) {
    this.nativeElement = el.nativeElement;
  }

  ngOnInit(): void {
    this.setDragHandle(this.nativeElement);
    this.subscribeForEvents();
  }

  setDragHandle(handle: HTMLElement): void {
    if (this.dragStartListener) {
      this.stylesService.resetHandleStyles(this.dragHandle);
      this.dragStartListener.unsubscribe();
    }

    this.dragHandle = handle;
    this.registerDragStartListener();
    this.stylesService.setHandleStyles(this.dragHandle);
  }

  private subscribeForEvents() {
    this.eventsService.events()
      .subscribe((e: DndEvent) => {
        if (DndEvent.ITEMS_DROPPED === e) {
          this.unregisterDragListener();
          this.eventsService.endDrag();
          this.removeClass(DndCss.DRAG_ACTIVE);
        } else if (DndEvent.DRAG_STARTED === e) {
          this.addClass(DndCss.DRAG);
        } else if (DndEvent.DRAG_ENDED === e) {
          this.removeClass(DndCss.DRAG);
        }
      });
  }

  private registerDragStartListener(): void {
    this.zone.runOutsideAngular(() => {
      this.dragStartListener = fromEvent(this.dragHandle, 'mousedown')
        .subscribe(() => this.startDrag());
    });
  }

  private registerDragListeners(): void {
    this.zone.runOutsideAngular(() => {
      fromEvent(this.document, 'mousemove')
        .pipe(takeUntil(this.drag$))
        .subscribe((event: MouseEvent) => this.drag(event));

      fromEvent(this.document, 'mouseup')
        .pipe(takeUntil(this.drag$))
        .subscribe(() => this.endDrag());
    });
  }

  private unregisterDragListener(): void {
    this.drag$.next();
  }

  private startDrag(): void {
    this.storeService.set(this.data);
    this.registerDragListeners();
    this.addClass(DndCss.DRAG_ACTIVE);
    this.eventsService.startDrag();
  }

  private drag(position: Position): void {
    this.stylesService.setPosition(this.nativeElement, position);
  }

  private endDrag(): void {
    this.storeService.clear();
    this.unregisterDragListener();
    this.stylesService.resetPosition(this.nativeElement);
    this.eventsService.endDrag();
  }

  private addClass(css: DndCss): void {
    this.stylesService.addClass(this.nativeElement, css);
  }

  private removeClass(css: DndCss): void {
    this.stylesService.addClass(this.nativeElement, css);
  }
}
